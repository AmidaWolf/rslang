import ServerApi from '../../../shared/utils/serverApi';
import { WordType } from '../../../types';
import { Page } from '../../Page';
import baseHTML from './baseHTML';
// eslint-disable-next-line import/no-cycle
import {
  getGameHTML,
  getAnswersHTML,
  getRightAnswerHTML,
  getGameResultsHTML,
  getSelectLevelHTML,
} from './game';

async function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class AudiogamePage implements Page {
  container: HTMLElement;

  private static level = 0;

  static arrayWords: WordType[] = [];

  static arrayIndexGameWords: number[] = [];

  private static resultGameWordsTrue: number[] = [];

  private static resultGameWordsFalse: number[] = [];

  static indexGameStep = 0;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    removeLoading();

    const audioGameWrapper = document.querySelector(
      '.audio-game__wrapper'
    ) as HTMLElement;

    audioGameWrapper.innerHTML = getSelectLevelHTML();

    const btnWrapper = document.querySelector('.audio-game__select-level');

    btnWrapper?.addEventListener('click', (el) => {
      const target = el.target as HTMLElement & {
        dataset: Record<string, string>;
      };
      const { level } = target.dataset;
      if (target.classList.contains('button')) {
        AudiogamePage.level = +level - 1;
      }
      AudiogamePage.runGame();
    });
  }

  static async runGame(): Promise<void> {
    AudiogamePage.arrayIndexGameWords = [];
    AudiogamePage.resultGameWordsTrue = [];
    AudiogamePage.resultGameWordsFalse = [];
    AudiogamePage.indexGameStep = 0;

    const arrayPromise: Promise<WordType[]>[] = [];
    for (let i = 0; i <= 29; i += 1) {
      arrayPromise.push(ServerApi.getWords(AudiogamePage.level, i));
    }

    AudiogamePage.arrayWords = (await Promise.all(arrayPromise)).flat();

    while (AudiogamePage.arrayIndexGameWords.length < 20) {
      const result = AudiogamePage.getIndexRandomWord();
      if (!AudiogamePage.arrayIndexGameWords.includes(result))
        AudiogamePage.arrayIndexGameWords.push(result);
    }

    AudiogamePage.showGame();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  private static getIndexRandomWord(): number {
    return Math.floor(Math.random() * AudiogamePage.arrayWords.length);
  }

  static showGame(): void {
    const audioGameWrapper = document.querySelector(
      '.audio-game__wrapper'
    ) as HTMLElement;

    audioGameWrapper.innerHTML = getGameHTML(
      AudiogamePage.indexGameStep,
      AudiogamePage.arrayIndexGameWords.length
    );

    AudiogamePage.showAnswers(
      AudiogamePage.arrayIndexGameWords[AudiogamePage.indexGameStep]
    );

    const btnNext = document.querySelector('.button.next') as HTMLButtonElement;

    btnNext.addEventListener('click', () => {
      AudiogamePage.indexGameStep += 1;
      if (
        AudiogamePage.indexGameStep < AudiogamePage.arrayIndexGameWords.length
      ) {
        AudiogamePage.showAnswers(
          AudiogamePage.arrayIndexGameWords[AudiogamePage.indexGameStep]
        );
      } else {
        btnNext.disabled = true;
        audioGameWrapper.innerHTML = getGameResultsHTML();
        const resTrueCont = document.querySelector(
          '.audio-game__answers-true'
        ) as HTMLElement;
        AudiogamePage.resultGameWordsTrue.forEach((i) => {
          resTrueCont.innerHTML += `
          <div class="word-wrapper">${AudiogamePage.arrayWords[i].word}&nbsp;${AudiogamePage.arrayWords[i].transcription}&nbsp;${AudiogamePage.arrayWords[i].wordTranslate}</div>
          `;
        });
        const resFalseCont = document.querySelector(
          '.audio-game__answers-false'
        ) as HTMLElement;
        AudiogamePage.resultGameWordsFalse.forEach((i) => {
          resFalseCont.innerHTML += `
          <div class="word-wrapper">${AudiogamePage.arrayWords[i].word}&nbsp;${AudiogamePage.arrayWords[i].transcription}&nbsp;${AudiogamePage.arrayWords[i].wordTranslate}</div>
          `;
        });

        console.log(AudiogamePage.resultGameWordsTrue);
        console.log(AudiogamePage.resultGameWordsFalse);
      }
    });
  }

  static showAnswers(index: number): void {
    const answersWrapper = document.querySelector(
      '.audio-game__answers'
    ) as HTMLElement;

    const resultContainer = document.querySelector(
      '.audio-game__result'
    ) as HTMLElement;

    resultContainer.innerHTML = `<div class="audio-word"></div>`;
    resultContainer.style.backgroundImage =
      '../../../../assets/img/sound_PNG13.png';

    const header = document.querySelector('.audio-game__title') as HTMLElement;
    header.textContent = `AudioGame - ${AudiogamePage.indexGameStep}/${AudiogamePage.arrayIndexGameWords.length}`;

    const btnNext = document.querySelector('.button.next') as HTMLButtonElement;
    btnNext.disabled = true;

    const answersIndexes: number[] = [];

    for (let i = 0; i < 4; i += 1) {
      answersIndexes.push(AudiogamePage.getIndexRandomWord());
    }
    while (answersIndexes.length < 4) {
      const result = AudiogamePage.getIndexRandomWord();
      if (!answersIndexes.includes(result) && result !== index)
        answersIndexes.push(result);
    }

    const randomNum: number = Math.floor(Math.random() * 5);
    answersIndexes.splice(randomNum, 0, index);
    answersWrapper.innerHTML = getAnswersHTML([
      AudiogamePage.arrayWords[answersIndexes[0]].wordTranslate,
      AudiogamePage.arrayWords[answersIndexes[1]].wordTranslate,
      AudiogamePage.arrayWords[answersIndexes[2]].wordTranslate,
      AudiogamePage.arrayWords[answersIndexes[3]].wordTranslate,
      AudiogamePage.arrayWords[answersIndexes[4]].wordTranslate,
    ]);

    const audio = document.querySelector('.question-audio') as HTMLAudioElement;
    const audioFail = document.querySelector('.audio-fail') as HTMLAudioElement;
    const audioFanfar = document.querySelector(
      '.audio-fanfar'
    ) as HTMLAudioElement;

    audioFail.currentTime = 0;
    audioFail.pause();
    audioFanfar.currentTime = 0;
    audioFanfar.pause();

    audio.src = `${ServerApi.baseURL}/${AudiogamePage.arrayWords[index].audio}`;
    audio.volume = 1;
    audio.play();

    const audioBtn = document.querySelector('.audio-word') as HTMLElement;

    audioBtn.addEventListener('click', () => audio.play());

    const rightAnswer = document.querySelector(
      `.button[data-text="${AudiogamePage.arrayWords[index].wordTranslate}"]`
    ) as HTMLElement;

    // eslint-disable-next-line prefer-arrow-callback
    answersWrapper.addEventListener('click', function x(el) {
      const target = el.target as HTMLElement;
      if (target.classList.contains('button')) {
        if (
          target.textContent !== AudiogamePage.arrayWords[index].wordTranslate
        ) {
          target.classList.add('button_false');
          AudiogamePage.resultGameWordsFalse.push(index);
          audioFail.play();
        } else {
          AudiogamePage.resultGameWordsTrue.push(index);
          audioFanfar.play();
        }
      }
      btnNext.disabled = false;
      rightAnswer.classList.add('button_true');
      answersWrapper.removeEventListener('click', x);
      AudiogamePage.showRightAnswer(AudiogamePage.arrayWords[index]);
      audio.volume = 0;
    });
  }

  private static showRightAnswer(word: WordType): void {
    const resultContainer = document.querySelector(
      '.audio-game__result'
    ) as HTMLElement;

    resultContainer.innerHTML = getRightAnswerHTML(word);
  }
}
