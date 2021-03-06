import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { getWordCard } from './card';
import ServerApi from '../../../shared/utils/serverApi';
import { WordType } from '../../../types';
import { isUserAuthorized } from '../../../shared/helpers/isUserAuthorized';
import { AudiogamePage } from '../AudiogamePage/AudiogamePage';
import { RoutesPath } from '../../../app/RoutesPath';
import { SprintgamePage } from '../SprintgamePage/SprintgamePage';

function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class TextbookPage implements Page {
  container: HTMLElement;

  private static maxPage = 29;

  private static currentPage = 0;

  private static currentGroup = 0;

  private static currentWordOnPage: WordType[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  static async appendCard(word: WordType) {
    const cards = <HTMLElement>document.querySelector('.cards');
    if (cards) cards.innerHTML += getWordCard(word);
  }

  static showPageNumber(): void {
    const pageText = document.querySelector('#page-text span');
    if (pageText) pageText.textContent = String(TextbookPage.currentPage + 1);

    const btnFirst = document.querySelector('#btn-first') as HTMLButtonElement;
    const btnPrev = document.querySelector('#btn-prev') as HTMLButtonElement;
    const btnNext = document.querySelector('#btn-next') as HTMLButtonElement;
    const btnLast = document.querySelector('#btn-last') as HTMLButtonElement;

    btnFirst.disabled = TextbookPage.currentPage === 0;
    btnPrev.disabled = TextbookPage.currentPage === 0;
    btnNext.disabled = TextbookPage.currentPage === TextbookPage.maxPage;
    btnLast.disabled = TextbookPage.currentPage === TextbookPage.maxPage;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    removeLoading();
    TextbookPage.currentPage = 0;
    TextbookPage.currentGroup = 0;
    TextbookPage.showPageNumber();
    await TextbookPage.renderCards();
    await TextbookPage.addButtonsListener();
    TextbookPage.addSevenGroup();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  static async renderCards(): Promise<void> {
    const cards = document.querySelector('.cards') as HTMLElement;
    cards.innerHTML = '';

    await TextbookPage.setData();

    TextbookPage.currentWordOnPage.forEach(async (el2) => {
      await TextbookPage.appendCard(el2);
    });

    TextbookPage.checkAllLearnedWordsOnPage();

    const btnsSound = document.querySelectorAll('.btn-sound');
    const audio2 = document.querySelector('.audio') as HTMLAudioElement;

    btnsSound.forEach((el) => {
      const target = <HTMLElement & { dataset: Record<string, string> }>el;
      const { src } = target.dataset;
      el.addEventListener('click', () => {
        audio2.src = src;
        audio2.currentTime = 0;
        audio2.play();
      });
    });

    const btnsDifficult = document.querySelectorAll('.difficult-word');
    const btnsLearnt = document.querySelectorAll('.learnt-word');

    btnsDifficult.forEach((el) => {
      el.addEventListener('click', async () => {
        const target = el.closest('.card-container') as HTMLElement & {
          dataset: Record<string, string>;
        };
        const btnLearnt = target.querySelector(
          '.learnt-word'
        ) as HTMLButtonElement;

        const { id } = target.dataset;
        if (target.classList.contains('hard')) {
          target.classList.remove('hard');
          target.classList.add('easy');
        } else {
          target.classList.remove('easy');
          target.classList.add('hard');
          target.classList.remove('learnt');
          btnLearnt.classList.remove('learnt-active');
        }
        await TextbookPage.changePropertyUserWord(id, 'difficulty');
        el.classList.toggle('difficult-active');
        TextbookPage.checkAllLearnedWordsOnPage();
        if (TextbookPage.currentGroup === 6) await TextbookPage.renderCards();
      });
    });

    btnsLearnt.forEach((el) => {
      el.addEventListener('click', async () => {
        const target = el.closest('.card-container') as HTMLElement & {
          dataset: Record<string, string>;
        };
        const btnDifficult = target.querySelector(
          '.difficult-word'
        ) as HTMLButtonElement;
        const { id } = target.dataset;

        if (!target.classList.contains('learnt')) {
          btnDifficult.classList.remove('difficult-active');
          target.classList.remove('hard');
          target.classList.add('easy');
        }

        await TextbookPage.changePropertyUserWord(id, 'learnt');
        el.classList.toggle('learnt-active');
        target.classList.toggle('learnt');
        TextbookPage.checkAllLearnedWordsOnPage();
        if (document.location.hash === '#/vocabulary')
          await TextbookPage.renderCards();
        if (TextbookPage.currentGroup === 6) await TextbookPage.renderCards();
      });
    });
  }

  static async setData(): Promise<void> {
    const userId = localStorage.getItem('userId') as string;

    if (document.location.hash === '#/vocabulary') {
      if (!isUserAuthorized()) {
        window.location.href = '/#/';
      } else {
        await TextbookPage.getUserWords();
      }
    } else if (TextbookPage.currentGroup === 6) {
      await TextbookPage.getDifficultWords();
    } else {
      TextbookPage.currentWordOnPage = isUserAuthorized()
        ? await ServerApi.getUserAggregatedWords(
            userId,
            TextbookPage.currentGroup,
            TextbookPage.currentPage,
            20
          )
        : await ServerApi.getWords(
            TextbookPage.currentGroup,
            TextbookPage.currentPage
          );
    }
  }

  static async addButtonsListener(): Promise<void> {
    const btnFirst = document.querySelector('#btn-first') as HTMLButtonElement;
    const btnPrev = document.querySelector('#btn-prev') as HTMLButtonElement;
    const btnNext = document.querySelector('#btn-next') as HTMLButtonElement;
    const btnLast = document.querySelector('#btn-last') as HTMLButtonElement;
    const btnAudio = document.querySelector(
      '#textbook__btn-audio'
    ) as HTMLButtonElement;
    const btnSprint = document.querySelector(
      '#textbook__btn-sprint'
    ) as HTMLButtonElement;
    const selectGroup = document.querySelector('#group-words');

    selectGroup?.addEventListener('change', async (el) => {
      const target = el.target as HTMLElement & { selectedIndex: string };
      TextbookPage.currentPage = 0;
      TextbookPage.currentGroup = +target.selectedIndex;
      if (TextbookPage.currentGroup !== 6) TextbookPage.maxPage = 29;
      this.showPageNumber();
      await TextbookPage.renderCards();
    });

    btnFirst.addEventListener('click', () => {
      if (TextbookPage.currentPage !== 0) {
        TextbookPage.currentPage = 0;
        TextbookPage.showPageNumber();
        TextbookPage.renderCards();
      }
    });

    btnLast.addEventListener('click', () => {
      if (TextbookPage.currentPage !== TextbookPage.maxPage) {
        TextbookPage.currentPage = TextbookPage.maxPage;
        TextbookPage.showPageNumber();
        TextbookPage.renderCards();
      }
    });

    btnPrev.addEventListener('click', () => {
      if (TextbookPage.currentPage > 0) {
        TextbookPage.currentPage -= 1;
        TextbookPage.showPageNumber();
        TextbookPage.renderCards();
      }
    });

    btnNext.addEventListener('click', () => {
      if (TextbookPage.currentPage < TextbookPage.maxPage) {
        TextbookPage.currentPage += 1;
        TextbookPage.showPageNumber();
        TextbookPage.renderCards();
      }
    });

    btnAudio.addEventListener('click', async () => {
      const resultArr = [...TextbookPage.currentWordOnPage];
      const count = resultArr.length;
        if (
        TextbookPage.currentWordOnPage.length < 20 &&
        TextbookPage.currentPage > 0
      ) {
        TextbookPage.currentPage -= 1;
        await TextbookPage.setData();
        for (let i = 19; i >= count; i -= 1) {
           resultArr.push(TextbookPage.currentWordOnPage[i]);
        }
      }

      if (resultArr.length < 2) {
        console.log("Game don't work with 1 word or nothing");
      } else {
        AudiogamePage.arrayWords = resultArr;
        window.location.hash = `#${RoutesPath.AUDIOGAME}`;
      }
    });

    btnSprint.addEventListener('click', async () => {
      const resultArr = [...TextbookPage.currentWordOnPage];

      while (TextbookPage.currentPage > 0) {
        TextbookPage.currentPage -= 1;
   
        await TextbookPage.setData();
        for (let i = 0; i < 20; i += 1) {
          resultArr.push(TextbookPage.currentWordOnPage[i]);
        }
      }
      TextbookPage.currentPage = 0;
        if (resultArr.length < 1) {
        console.log("Game don't work with 1 word or nothing");
      } else {
        SprintgamePage.arrayWords = resultArr;
        window.location.hash = `#${RoutesPath.SPRINTGAME}`;
      }
    });
  }

  private static async changePropertyUserWord(
    id: string,
    attr: string
  ): Promise<void> {
    const userId = localStorage.getItem('userId') as string;
    const wordUser = await ServerApi.getUserWord(userId, id);
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

      if (attr === 'difficulty') {
        if (wordUser.difficulty === 'easy') {
          obj.difficulty = 'hard';
          obj.optional.learnt = false;
        } else {
          obj.difficulty = 'easy';
        }
      }
      if (attr === 'learnt') {
        if (!wordUser.optional.learnt) {
          obj.difficulty = 'easy';
        }
        obj.optional.learnt = !wordUser.optional.learnt;
      }
      await ServerApi.updateUserWord(userId, id, obj);
    } else {
      if (attr === 'difficulty') obj.difficulty = 'hard';
      if (attr === 'learnt') obj.optional.learnt = true;

      await ServerApi.createUserWord(userId, id, obj);
    }
  }

  private static addSevenGroup(): void {
    if (isUserAuthorized() && document.location.hash === '#/textbook') {
      const selectGroup = document.querySelector('#group-words') as HTMLElement;
      selectGroup.innerHTML += `
      <option value="group-7">Difficult words</option>
      `;
    }
  }

  private static async getDifficultWords(): Promise<void> {
    const userId = localStorage.getItem('userId') as string;

    const res = await ServerApi.getUserHardWords(
      userId,
      TextbookPage.currentPage
    );
    const result = res?.array;
    if (res?.countAll !== undefined)
      TextbookPage.maxPage = Math.floor(res.countAll / 21);
    TextbookPage.showPageNumber();
    if (result) TextbookPage.currentWordOnPage = result;
  }

  private static async getUserWords(): Promise<void> {
    const userId = localStorage.getItem('userId') as string;

    const res = await ServerApi.getAllUserWords(
      userId,
      TextbookPage.currentPage,
      TextbookPage.currentGroup
    );
    const result = res?.array;
    if (res?.countAll !== undefined)
      TextbookPage.maxPage = Math.floor(res.countAll / 21);
    TextbookPage.showPageNumber();
    if (result) TextbookPage.currentWordOnPage = result;
  }

  private static checkAllLearnedWordsOnPage(): void {
    const cardsContainers = document.querySelectorAll(
      '.card-container'
    ) as NodeListOf<HTMLElement>;
    const cardsContainer = document.querySelector('.cards') as HTMLElement;
    const btnAudioGame = document.querySelector(
      '#textbook__btn-audio'
    ) as HTMLButtonElement;
    const btnSprintGame = document.querySelector(
      '#textbook__btn-sprint'
    ) as HTMLButtonElement;
    const numPage = document.querySelector('.page-text') as HTMLSpanElement;

    let result = true;
    cardsContainers.forEach((el) => {
      if (!el.classList.contains('learnt')) result = false;
    });
    if (cardsContainers.length === 0) result = false;
    if (result) {
      numPage.classList.add('green-page');
      cardsContainer.classList.add('all-learnt');
      btnAudioGame.disabled = true;
      btnSprintGame.disabled = true;
    } else {
      numPage.classList.remove('green-page');
      cardsContainer.classList.remove('all-learnt');
      btnAudioGame.disabled = false;
      btnSprintGame.disabled = false;
    }
  }
}
