import ServerApi from '../../../shared/utils/serverApi';
import { WordType } from '../../../types';
import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { getGameHTML, getGameResultsHTML } from './game';

async function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class SprintgamePage implements Page {
  container: HTMLElement;

  static level = 0;

  static arrayWords: WordType[] = [];

  static arrayIndexGameWords: number[] = [];

  static indexGameStep = 0;

  static score = 0;

  static scoreAdd = 10;

  static countStepsNoErrors = 0;

  static currentQuestion: boolean;

  private static resultGameWordsTrue: number[] = [];

  private static resultGameWordsFalse: number[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    await this.setDataGame();
    removeLoading();
    SprintgamePage.showGame();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  async setDataGame(): Promise<void> {
    SprintgamePage.score = 0;
    SprintgamePage.scoreAdd = 10;
    SprintgamePage.countStepsNoErrors = 0;
    SprintgamePage.resultGameWordsTrue = [];
    SprintgamePage.resultGameWordsFalse = [];
    SprintgamePage.arrayIndexGameWords = [];
    SprintgamePage.indexGameStep = 0;

    const arrayPromise: Promise<WordType[]>[] = [];
    for (let i = 0; i <= 29; i += 1) {
      arrayPromise.push(ServerApi.getWords(SprintgamePage.level, i));
    }

    SprintgamePage.arrayWords = (await Promise.all(arrayPromise)).flat();

    const arrayIndexAll = Object.keys(SprintgamePage.arrayWords);

    while (
      SprintgamePage.arrayIndexGameWords.length <
      SprintgamePage.arrayWords.length
    ) {
      const result = arrayIndexAll.splice(
        Math.floor(Math.random() * arrayIndexAll.length),
        1
      );
      SprintgamePage.arrayIndexGameWords.push(+result);
    }
  }

  private static getIndexRandomWord(): number {
    return Math.floor(Math.random() * SprintgamePage.arrayWords.length);
  }

  static showGame(): void {
    const audioFail = new Audio('../../../../assets/fail.mp3');
    const audioFanfar = new Audio('../../../../assets/fanfar.mp3');
    const sprintGameWrapper = document.querySelector(
      '.sprint__wrapper'
    ) as HTMLElement;

    sprintGameWrapper.innerHTML = getGameHTML();

    const textTimer = document.querySelector(
      '.sprint__timer span'
    ) as HTMLSpanElement;

    let timeLeft = 60;

    const timerInterval = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft > 9) {
        textTimer.textContent = `00:${timeLeft}`;
      } else {
        textTimer.textContent = `00:0${timeLeft}`;
      }
    }, 1000);

    this.updateDataQuestion();

    setInterval(() => {
      clearInterval(timerInterval);
      this.showResultsGame();
    }, 60000);

    const buttonsContainer = document.querySelector(
      '.sprint-buttons'
    ) as HTMLElement;

    buttonsContainer.addEventListener('click', (el) => {
      const target = el.target as HTMLElement;
      if (target.classList.contains('button')) {
        const answerUser = target.id.slice(4) === 'true';

        let answer: boolean;
        const wordCurrent =
          SprintgamePage.arrayWords[
            SprintgamePage.arrayIndexGameWords[SprintgamePage.indexGameStep]
          ];
        const translateContainer = document.querySelector(
          '.word-translate'
        ) as HTMLElement;
        const translateCurrent = translateContainer.textContent;

        if (wordCurrent.wordTranslate === translateCurrent) {
          answer = true;
        } else {
          answer = false;
        }

        audioFanfar.pause();
        audioFanfar.currentTime = 0;
        audioFail.pause();
        audioFail.currentTime = 0;

        if (answerUser === answer) {
          audioFanfar.play();
          this.resultGameWordsTrue.push(
            SprintgamePage.arrayIndexGameWords[SprintgamePage.indexGameStep]
          );
          this.countStepsNoErrors += 1;
          this.score += this.scoreAdd;
          if (this.countStepsNoErrors === 4) this.scoreAdd = 20;
          if (this.countStepsNoErrors === 8) this.scoreAdd = 40;
          if (this.countStepsNoErrors === 12) this.scoreAdd = 80;
        } else {
          audioFail.play();
          this.resultGameWordsFalse.push(
            SprintgamePage.arrayIndexGameWords[SprintgamePage.indexGameStep]
          );
          this.scoreAdd = 10;
          this.countStepsNoErrors = 0;
        }
        this.indexGameStep += 1;
        this.updateDataQuestion();
      }
    });
  }

  static updateDataQuestion(): void {
    const score = document.querySelector(
      '.sprint__title span'
    ) as HTMLSpanElement;
    const word = document.querySelector('.word-text') as HTMLElement;
    const translate = document.querySelector('.word-translate') as HTMLElement;
    const textScoreWord = document.querySelector(
      '.text-score-word'
    ) as HTMLParagraphElement;
    const numScoreWord = textScoreWord.querySelector('span') as HTMLSpanElement;
    const dots = document.querySelectorAll('.dot') as NodeListOf<HTMLElement>;
    dots.forEach((el) => {
      const dot = el;
      dot.style.backgroundColor = 'transparent';
      dot.style.display = 'block';
    });

    if (this.countStepsNoErrors < 12) {
      for (let i = 0; i < this.countStepsNoErrors % 4; i += 1) {
        dots[i].style.backgroundColor = 'green';
      }
    } else {
      dots[0].style.display = 'none';
      dots[2].style.display = 'none';
      dots[1].style.backgroundColor = 'green';
    }

    if (this.countStepsNoErrors < 4) {
      textScoreWord.style.color = 'green';
    } else if (this.countStepsNoErrors < 8) {
      textScoreWord.style.color = 'yellow';
    } else if (this.countStepsNoErrors < 12) {
      textScoreWord.style.color = 'orange';
    } else {
      textScoreWord.style.color = 'red';
    }
    numScoreWord.textContent = String(this.scoreAdd);
    score.textContent = String(SprintgamePage.score);

    word.textContent =
      SprintgamePage.arrayWords[
        SprintgamePage.arrayIndexGameWords[SprintgamePage.indexGameStep]
      ].word;

    if (Math.random() < 0.5) {
      this.currentQuestion = true;
      translate.textContent =
        SprintgamePage.arrayWords[
          SprintgamePage.arrayIndexGameWords[SprintgamePage.indexGameStep]
        ].wordTranslate;
    } else {
      this.currentQuestion = false;
      const wordRandom = this.getIndexRandomWord();
      translate.textContent =
        SprintgamePage.arrayWords[wordRandom].wordTranslate;
    }
  }

  static showResultsGame(): void {
    const sprintGameWrapper = document.querySelector(
      '.sprint__wrapper'
    ) as HTMLElement;
    sprintGameWrapper.innerHTML = getGameResultsHTML(SprintgamePage.score);
    const resTrueCont = document.querySelector(
      '.audio-game__answers-true'
    ) as HTMLElement;
    SprintgamePage.resultGameWordsTrue.forEach((i) => {
      resTrueCont.innerHTML += `
      <div class="word-wrapper">${SprintgamePage.arrayWords[i].word}&nbsp;${SprintgamePage.arrayWords[i].transcription}&nbsp;${SprintgamePage.arrayWords[i].wordTranslate}</div>
      `;
    });
    const resFalseCont = document.querySelector(
      '.audio-game__answers-false'
    ) as HTMLElement;
    SprintgamePage.resultGameWordsFalse.forEach((i) => {
      resFalseCont.innerHTML += `
      <div class="word-wrapper">${SprintgamePage.arrayWords[i].word}&nbsp;${SprintgamePage.arrayWords[i].transcription}&nbsp;${SprintgamePage.arrayWords[i].wordTranslate}</div>
      `;
    });
  }
}
