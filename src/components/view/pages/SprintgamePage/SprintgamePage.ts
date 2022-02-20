import { isUserAuthorized } from '../../../shared/helpers/isUserAuthorized';
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

  private static timerStart: NodeJS.Timer;

  private static audioFail = new Audio('../../../../assets/fail.mp3');

  private static audioFanfar = new Audio('../../../../assets/fanfar.mp3');

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
    SprintgamePage.score = 0;
    SprintgamePage.scoreAdd = 10;
    SprintgamePage.countStepsNoErrors = 0;
    SprintgamePage.resultGameWordsTrue = [];
    SprintgamePage.resultGameWordsFalse = [];
    SprintgamePage.arrayIndexGameWords = [];
    SprintgamePage.indexGameStep = 0;

    await this.setDataGame();
    removeLoading();
    const sprintGameWrapper = document.querySelector(
      '.sprint__wrapper'
    ) as HTMLElement;
    sprintGameWrapper.innerHTML = '';
    let secondsLast = 4;
    SprintgamePage.timerStart = setInterval(() => {
      if (secondsLast === 4) {
        sprintGameWrapper.innerHTML = `<div class="timer-start">READY?</div>`;
        secondsLast -= 1;
      } else if (secondsLast > 0 && secondsLast < 4) {
        sprintGameWrapper.innerHTML = `<div class="timer-start">${secondsLast}</div>`;
        secondsLast -= 1;
      } else if (secondsLast === 0) {
        sprintGameWrapper.innerHTML = `<div class="timer-start">GO!</div>`;
        secondsLast -= 1;
      } else {
        clearInterval(SprintgamePage.timerStart);
        SprintgamePage.showGame();
      }
    }, 1000);
    window.addEventListener('hashchange', function y() {
      clearInterval(SprintgamePage.timerStart);
      window.removeEventListener('hashchange', y);
    });
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  async setDataGame(): Promise<void> {
    if (SprintgamePage.arrayWords.length === 0) {
      const arrayPromise: Promise<WordType[]>[] = [];
      for (let i = 0; i <= 29; i += 1) {
        arrayPromise.push(ServerApi.getWords(SprintgamePage.level, i));
      }

      SprintgamePage.arrayWords = (await Promise.all(arrayPromise)).flat();
    }

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

    const timerResult = setInterval(() => {
      clearInterval(timerInterval);
      document.removeEventListener('keydown', SprintgamePage.checkKeys);
      this.showResultsGame();
    }, 60000);

    const buttonsContainer = document.querySelector(
      '.sprint-buttons'
    ) as HTMLElement;

    buttonsContainer.addEventListener('click', (el) => {
      const target = el.target as HTMLElement;
      if (target.classList.contains('button')) {
        const answerUser = target.id.slice(4) === 'true';
        this.checkAnswer(answerUser);
        if (
          SprintgamePage.indexGameStep ===
          SprintgamePage.arrayIndexGameWords.length
        ) {
          clearInterval(timerInterval);
          clearTimeout(timerResult);
        }
      }
    });

    document.addEventListener('keydown', SprintgamePage.checkKeys);
    window.addEventListener('hashchange', function x() {
      document.removeEventListener('keydown', SprintgamePage.checkKeys);
      clearInterval(timerInterval);
      clearTimeout(timerResult);
      window.removeEventListener('hashchange', x);
    });
  }

  private static checkKeys(el: KeyboardEvent): void {
    if (el.code === 'ArrowRight') SprintgamePage.checkAnswer(true);
    if (el.code === 'ArrowLeft') SprintgamePage.checkAnswer(false);
  }

  static checkAnswer(answerUser: boolean): void {
    const wordCurrent =
      SprintgamePage.arrayWords[
        SprintgamePage.arrayIndexGameWords[SprintgamePage.indexGameStep]
      ];
    const translateContainer = document.querySelector(
      '.word-translate'
    ) as HTMLElement;
    const translateCurrent = translateContainer.textContent;

    const answer = wordCurrent.wordTranslate === translateCurrent;

    SprintgamePage.audioFanfar.pause();
    SprintgamePage.audioFanfar.currentTime = 0;
    SprintgamePage.audioFail.pause();
    SprintgamePage.audioFail.currentTime = 0;

    if (answerUser === answer) {
      SprintgamePage.uploadResultToServer(wordCurrent, true);
      SprintgamePage.audioFanfar.play();
      this.resultGameWordsTrue.push(
        SprintgamePage.arrayIndexGameWords[SprintgamePage.indexGameStep]
      );
      this.countStepsNoErrors += 1;
      this.score += this.scoreAdd;
      if (this.countStepsNoErrors === 4) this.scoreAdd = 20;
      if (this.countStepsNoErrors === 8) this.scoreAdd = 40;
      if (this.countStepsNoErrors === 12) this.scoreAdd = 80;
    } else {
      SprintgamePage.uploadResultToServer(wordCurrent, false);
      SprintgamePage.audioFail.play();
      this.resultGameWordsFalse.push(
        SprintgamePage.arrayIndexGameWords[SprintgamePage.indexGameStep]
      );
      this.scoreAdd = 10;
      this.countStepsNoErrors = 0;
    }

    SprintgamePage.indexGameStep += 1;
    if (
      SprintgamePage.indexGameStep === SprintgamePage.arrayIndexGameWords.length
    ) {
      document.removeEventListener('keydown', SprintgamePage.checkKeys);
      SprintgamePage.showResultsGame();
    } else {
      SprintgamePage.updateDataQuestion();
    }
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

    SprintgamePage.arrayWords = [];
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
        console.log('Update user word');
        obj.difficulty = wordUser.difficulty;
        obj.optional.sprint = wordUser.optional.sprint;
        obj.optional.audio = wordUser.optional.audio;
        obj.optional.allGames = wordUser.optional.allGames;

        obj.optional.sprint += result ? '1' : '0';
        obj.optional.allGames += result ? '1' : '0';

        if (
          obj.difficulty === 'easy' &&
          obj.optional.allGames.slice(-3) === '111'
        ) {
          obj.optional.learnt = true;
        } else if (
          obj.difficulty === 'hard' &&
          obj.optional.allGames.slice(-5) === '11111'
        ) {
          obj.optional.learnt = true;
        } else {
          obj.optional.learnt = false;
        }

        await ServerApi.updateUserWord(userId, word.id, obj);
      } else {
        console.log('Create new user word');
        obj.optional.sprint += result ? '1' : '0';
        obj.optional.allGames += result ? '1' : '0';
        obj.optional.learnt = false;
        await ServerApi.createUserWord(userId, word.id, obj);
      }

      const wordUser2 = await ServerApi.getUserWord(userId, word.id);
      console.log(wordUser2);
    }
  }
}
