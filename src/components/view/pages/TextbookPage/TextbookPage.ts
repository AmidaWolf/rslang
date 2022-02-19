import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { getWordCard } from './card';
import ServerApi from '../../../shared/utils/serverApi';
import { listControlButtons } from '../../../shared/helpers/wordCardSupport';
import { WordType } from '../../../types';
import { isUserAuthorized } from '../../../shared/helpers/isUserAuthorized';

async function removeLoading() {
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
    await TextbookPage.renderCards();
    await TextbookPage.addButtonsListener();
    TextbookPage.addSevenGroup();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  static async renderCards(): Promise<void> {
    if (TextbookPage.currentGroup === 6)
      TextbookPage.renderDifficultWordsGroup();

    const cards = document.querySelector('.cards');

    if (cards) cards.innerHTML = '';

    const wordsArray = await ServerApi.getWords(
      TextbookPage.currentGroup,
      TextbookPage.currentPage
    );

    const arrayOfWordsPromises: Promise<void>[] = wordsArray.map(
      async (word) => {
        await TextbookPage.appendCard(word);
      }
    );

    await Promise.all(arrayOfWordsPromises);

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
  }

  static async addButtonsListener(): Promise<void> {
    const cards = document.querySelector('.cards');
    const btnFirst = document.querySelector('#btn-first') as HTMLButtonElement;
    const btnPrev = document.querySelector('#btn-prev') as HTMLButtonElement;
    const btnNext = document.querySelector('#btn-next') as HTMLButtonElement;
    const btnLast = document.querySelector('#btn-last') as HTMLButtonElement;
    const selectGroup = document.querySelector('#group-words');

    selectGroup?.addEventListener('change', async (el) => {
      const target = el.target as HTMLElement & { selectedIndex: string };
      TextbookPage.currentPage = 0;
      TextbookPage.currentGroup = +target.selectedIndex;
      if (TextbookPage.currentGroup === 6) {
        TextbookPage.renderDifficultWordsGroup();
      } else {
        TextbookPage.maxPage = 29;
        this.showPageNumber();
        TextbookPage.renderCards();
      }
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

    cards?.addEventListener('click', (e) => {
      listControlButtons(e);
    });
  }

  private static addSevenGroup(): void {
    if (isUserAuthorized()) {
      const selectGroup = document.querySelector('#group-words') as HTMLElement;
      selectGroup.innerHTML += `
      <option value="group-7">Difficult words</option>
      `;
    }
  }

  private static async getDifficultWords(): Promise<void> {
    let result: WordType[] = [];
    const stringID = localStorage.getItem('difficultWords');
    if (stringID) {
      const arrayAllID = stringID.split(';');
      TextbookPage.maxPage = Math.ceil(arrayAllID.length / 20) - 1;
      const arrayID = arrayAllID.slice(
        TextbookPage.currentPage * 20,
        (TextbookPage.currentPage + 1) * 20
      );
      const promises: Promise<WordType>[] = [];
      arrayID.forEach((el) => {
        promises.push(ServerApi.getWord(el));
      });
      result = await Promise.all(promises);
    }
    TextbookPage.currentWordOnPage = result;
  }

  private static async renderDifficultWordsGroup(): Promise<void> {
    const cards = document.querySelector('.cards') as HTMLElement;

    cards.innerHTML = '';

    await TextbookPage.getDifficultWords();
    TextbookPage.showPageNumber();

    TextbookPage.currentWordOnPage.forEach((el2) => {
      TextbookPage.appendCard(el2);
    });

    if (TextbookPage.currentGroup === 6) {
      const btnsDifficult = document.querySelectorAll('.difficult-word');
      btnsDifficult.forEach((el) => {
        const callback = (
          mutations: MutationRecord[],
          observer: MutationObserver
        ) => {
          mutations.forEach((mutation) => {
            console.log(mutation, observer);
            TextbookPage.renderDifficultWordsGroup();
          });
        };
        const mutationObserver = new MutationObserver(callback);
        const config = {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
          attributeOldValue: true,
          characterDataOldValue: true,
        };
        mutationObserver.observe(el, config);
      });
    }
  }
}
