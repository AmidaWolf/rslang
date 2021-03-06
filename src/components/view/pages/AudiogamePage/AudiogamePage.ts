import { isUserAuthorized } from '../../../shared/helpers/isUserAuthorized';
import ServerApi from '../../../shared/utils/serverApi';
import { WordType } from '../../../types';
import { Page } from '../../Page';
import baseHTML from './baseHTML';

import {
  getGameHTML,
  getAnswersHTML,
  getRightAnswerHTML,
  getGameResultsHTML,
} from './game';
import { renderSources } from '../../../shared/helpers/renderSources';

function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class AudiogamePage implements Page {
  container: HTMLElement;

  private static timerStart: NodeJS.Timer;

  private static audioFail = new Audio('../../../../assets/fail.mp3');

  private static audioFanfar = new Audio('../../../../assets/fanfar.mp3');

  static level = 0;

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
    AudiogamePage.arrayIndexGameWords = [];
    AudiogamePage.resultGameWordsTrue = [];
    AudiogamePage.resultGameWordsFalse = [];
    AudiogamePage.indexGameStep = 0;

    await AudiogamePage.setDataGame();
    removeLoading();
    const audioGameWrapper = document.querySelector(
      '.audio-game__wrapper'
    ) as HTMLElement;

    const secondsStart = 0;
    const secondsLast = 4;
    let secondsCount = 4;
    AudiogamePage.timerStart = setInterval(() => {
      if (secondsCount === secondsLast) {
        audioGameWrapper.innerHTML = `<div class="timer-start">READY?</div>`;
        secondsCount -= 1;
      } else if (secondsCount > secondsStart && secondsCount < secondsLast) {
        audioGameWrapper.innerHTML = `<div class="timer-start">${secondsCount}</div>`;
        secondsCount -= 1;
      } else if (secondsCount === secondsStart) {
        audioGameWrapper.innerHTML = `<div class="timer-start">GO!</div>`;
        secondsCount -= 1;
      } else {
        clearInterval(AudiogamePage.timerStart);
        AudiogamePage.showGame();
      }
    }, 1000);
    window.addEventListener('hashchange', function disableTimerAudioStart() {
      clearInterval(AudiogamePage.timerStart);
      window.removeEventListener('hashchange', disableTimerAudioStart);
    });
  }

  static async setDataGame(): Promise<void> {
    if (AudiogamePage.arrayWords.length === 0) {
      const arrayPromise: Promise<WordType[]>[] = [];
      for (let i = 0; i <= 29; i += 1) {
        arrayPromise.push(ServerApi.getWords(AudiogamePage.level, i));
      }
      AudiogamePage.arrayWords = (await Promise.all(arrayPromise)).flat();
    }
    while (
      AudiogamePage.arrayIndexGameWords.length < 20 &&
      AudiogamePage.arrayIndexGameWords.length < AudiogamePage.arrayWords.length
    ) {
      const result = AudiogamePage.getIndexRandomWord();
      if (!AudiogamePage.arrayIndexGameWords.includes(result))
        AudiogamePage.arrayIndexGameWords.push(result);
    }
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

    const answersWrapper = document.querySelector(
      '.audio-game__answers'
    ) as HTMLElement;

    AudiogamePage.showAnswers(
      AudiogamePage.arrayIndexGameWords[AudiogamePage.indexGameStep]
    );

    const btnNext = document.querySelector('.button.next') as HTMLButtonElement;

    btnNext.addEventListener('click', AudiogamePage.btnNext);

    answersWrapper.addEventListener('click', async (el) => {
      const target = el.target as HTMLElement;
      if (target.classList.contains('button')) {
        await AudiogamePage.checkAnswer(target);
        btnNext.disabled = false;
      }
    });

    document.addEventListener('keydown', AudiogamePage.checkKeys);
    window.addEventListener('hashchange', function x() {
      document.removeEventListener('keydown', AudiogamePage.checkKeys);
      AudiogamePage.arrayWords = [];
      window.removeEventListener('hashchange', x);
    });
  }

  private static btnNext(event?): void {
    const btnNext = event
      ? event.target
      : (document.querySelector('.button.next') as HTMLButtonElement);

    AudiogamePage.indexGameStep += 1;
    if (
      AudiogamePage.indexGameStep < AudiogamePage.arrayIndexGameWords.length
    ) {
      AudiogamePage.showAnswers(
        AudiogamePage.arrayIndexGameWords[AudiogamePage.indexGameStep]
      );
    } else {
      btnNext.disabled = true;
      document.removeEventListener('keydown', AudiogamePage.checkKeys);
      AudiogamePage.showResults();
    }
  }

  static showResults(): void {
    const audioGameWrapper = document.querySelector(
      '.audio-game__wrapper'
    ) as HTMLElement;
    audioGameWrapper.innerHTML = getGameResultsHTML();
    const resTrueCont = document.querySelector(
      '.audio-game__answers-true'
    ) as HTMLElement;
    AudiogamePage.resultGameWordsTrue.forEach((i) => {
      resTrueCont.innerHTML += `
      <p class="word-wrapper">${AudiogamePage.arrayWords[i].word}&nbsp;${AudiogamePage.arrayWords[i].transcription}&nbsp;${AudiogamePage.arrayWords[i].wordTranslate}</p>
      `;
    });
    const resFalseCont = document.querySelector(
      '.audio-game__answers-false'
    ) as HTMLElement;
    AudiogamePage.resultGameWordsFalse.forEach((i) => {
      resFalseCont.innerHTML += `
      <p class="word-wrapper">${AudiogamePage.arrayWords[i].word}&nbsp;${AudiogamePage.arrayWords[i].transcription}&nbsp;${AudiogamePage.arrayWords[i].wordTranslate}</p>
      `;
    });

    AudiogamePage.arrayWords = [];
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
    header.textContent = `AudioGame - ${AudiogamePage.indexGameStep + 1}/${
      AudiogamePage.arrayIndexGameWords.length
    }`;

    const btnNext = document.querySelector('.button.next') as HTMLButtonElement;
    btnNext.disabled = true;

    const answersIndexes: number[] = [];

    for (let i = 0; i < 4; i += 1) {
      let findedRandomWord = false;
      let randomIndexWord = 100000;
      while (!findedRandomWord) {
        const random = AudiogamePage.getIndexRandomWord();
        if (random !== index || AudiogamePage.arrayWords.length === 1) {
          if (
            !answersIndexes.includes(random) ||
            AudiogamePage.arrayWords.length < 4
          ) {
            randomIndexWord = random;
            findedRandomWord = true;
          }
        }
      }
      if (randomIndexWord !== 100000) answersIndexes.push(randomIndexWord);
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

    const btnsAnswers = document.querySelectorAll(
      '.audio-game__answers .button'
    ) as NodeListOf<HTMLButtonElement>;
    btnsAnswers.forEach((el) => {
      const btn = el;
      btn.disabled = false;
    });

    const audio = document.querySelector('.question-audio') as HTMLAudioElement;

    AudiogamePage.audioFail.currentTime = 0;
    AudiogamePage.audioFail.pause();
    AudiogamePage.audioFanfar.currentTime = 0;
    AudiogamePage.audioFanfar.pause();

    audio.src = `${ServerApi.baseURL}/${AudiogamePage.arrayWords[index].audio}`;
    audio.volume = 1;
    audio.play();

    const audioBtn = document.querySelector('.audio-word') as HTMLElement;

    audioBtn.addEventListener('click', () => audio.play());
  }

  private static async checkKeys(el: KeyboardEvent): Promise<void> {
    const btnsAnswers = document.querySelectorAll(
      '.audio-game__answers .button'
    ) as NodeListOf<HTMLButtonElement>;
    const btnNext = document.querySelector('.button.next') as HTMLButtonElement;
    const audio = document.querySelector('.question-audio') as HTMLAudioElement;

    if (+el.key >= 1 && +el.key <= 5 && !btnsAnswers[+el.key - 1].disabled) {
      await AudiogamePage.checkAnswer(btnsAnswers[+el.key - 1]);
      btnNext.disabled = false;
      audio.volume = 0;
    }
    if (el.key === 'Enter' && !btnNext.disabled) {
      AudiogamePage.btnNext();
    }
    if (el.key === ' ') {
      el.preventDefault();
      await audio.play();
    }
  }

  static async checkAnswer(target: HTMLElement): Promise<void> {
    const btnsAnswers = document.querySelectorAll(
      '.audio-game__answers .button'
    ) as NodeListOf<HTMLButtonElement>;
    btnsAnswers.forEach((el) => {
      const btn = el;
      btn.disabled = true;
    });
    const answerWordTranslate = (target.textContent as string).slice(3);
    const index =
      AudiogamePage.arrayIndexGameWords[AudiogamePage.indexGameStep];
    const rightAnswer = document.querySelector(
      `.button[data-text="${AudiogamePage.arrayWords[index].wordTranslate}"]`
    ) as HTMLElement;

    if (answerWordTranslate !== AudiogamePage.arrayWords[index].wordTranslate) {
      target.classList.add('button_false');
      AudiogamePage.resultGameWordsFalse.push(index);
      await AudiogamePage.audioFail.play();
      await AudiogamePage.uploadResultToServer(
        AudiogamePage.arrayWords[index],
        false
      );
    } else {
      AudiogamePage.resultGameWordsTrue.push(index);
      await AudiogamePage.audioFanfar.play();
      await AudiogamePage.uploadResultToServer(
        AudiogamePage.arrayWords[index],
        true
      );
    }
    rightAnswer.classList.add('button_true');
    await AudiogamePage.showRightAnswer(AudiogamePage.arrayWords[index]);
  }

  private static async showRightAnswer(word: WordType): Promise<void> {
    const resultContainer = document.querySelector(
      '.audio-game__result'
    ) as HTMLElement;

    const wordImg = await renderSources.renderImageHTML(
      `${ServerApi.baseURL}/${word.image}`,
      `${word.word}`,
      'card__picture-image',
      390,
      260
    );

    resultContainer.innerHTML = getRightAnswerHTML(word, wordImg);
  }

  static async uploadResultToServer(
    word: WordType,
    result: boolean
  ): Promise<void> {
    if (isUserAuthorized()) {
      const userId = localStorage.getItem('userId') as string;
      const wordUser = await ServerApi.getUserWord(userId, word.id);

      const obj = {
        difficulty: 'easy',
        optional: {
          sprint: ' ',
          audio: ' ',
          allGames: ' ',
          learnt: false,
        },
      };

      if (wordUser) {
        obj.difficulty = wordUser.difficulty;
        obj.optional.sprint = wordUser.optional.sprint;
        obj.optional.audio = wordUser.optional.audio;
        obj.optional.allGames = wordUser.optional.allGames;
        obj.optional.learnt = wordUser.optional.learnt;

        obj.optional.audio += result ? '1' : '0';
        obj.optional.allGames += result ? '1' : '0';

        if (
          obj.difficulty === 'easy' &&
          obj.optional.allGames.slice(-3) === '111'
        ) {
          obj.optional.learnt = true;
          obj.difficulty = 'easy';
        } else if (
          obj.difficulty === 'hard' &&
          obj.optional.allGames.slice(-5) === '11111'
        ) {
          obj.optional.learnt = true;
          obj.difficulty = 'easy';
        } else {
          obj.optional.learnt = false;
        }

        await ServerApi.updateUserWord(userId, word.id, obj);
      } else {
        obj.optional.audio += result ? '1' : '0';
        obj.optional.allGames += result ? '1' : '0';
        await ServerApi.createUserWord(userId, word.id, obj);
      }
    }
  }
}
