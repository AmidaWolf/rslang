import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { getWordCard } from './card';
import ServerApi from '../../../shared/utils/serverApi';
import { getUniqueLocalWordsArray } from '../../../shared/helpers/dataManipulations';
import { listControlButtons } from '../../../shared/helpers/wordCardSupport';
import { WordType } from '../../../types';

async function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class VocabularyPage implements Page {
  container: HTMLElement;

  private static currentPage = 0;

  private static currentGroup = 0;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  static async appendCard(word: WordType) {
    const cards = <HTMLElement>document.querySelector('.cards');
    if (cards) cards.innerHTML += getWordCard(word);
  }

  static showPageNumber(): void {
    const pageText = document.querySelector('#page-text span');
    if (pageText) pageText.textContent = String(VocabularyPage.currentPage + 1);
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    removeLoading();
    await VocabularyPage.renderCards();
    await VocabularyPage.addButtonsListener();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  static async renderCards(): Promise<void> {
    const cards = document.querySelector('.cards');

    if (cards) cards.innerHTML = '';

    const localWordsArray = getUniqueLocalWordsArray();

    const arrayOfWordsPromises: Promise<void>[] = localWordsArray.map(
      async (wordId) => {
        ServerApi.getWord(wordId).then((word) =>
          VocabularyPage.appendCard(word)
        );
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
    const selectGroup = document.querySelector('.group-words');

    selectGroup?.addEventListener('change', (el) => {
      const target = el.target as HTMLElement & { selectedIndex: string };
      VocabularyPage.currentPage = 0;
      this.showPageNumber();
      VocabularyPage.currentGroup = +target.selectedIndex;
      VocabularyPage.renderCards();
    });

    btnFirst.addEventListener('click', () => {
      if (VocabularyPage.currentPage !== 0) {
        VocabularyPage.currentPage = 0;
        btnNext.disabled = false;
        btnLast.disabled = false;
        btnFirst.disabled = true;
        btnPrev.disabled = true;
        VocabularyPage.showPageNumber();
        VocabularyPage.renderCards();
      }
    });

    btnLast.addEventListener('click', () => {
      if (VocabularyPage.currentPage !== 29) {
        VocabularyPage.currentPage = 29;
        btnNext.disabled = true;
        btnLast.disabled = true;
        btnFirst.disabled = false;
        btnPrev.disabled = false;
        VocabularyPage.showPageNumber();
        VocabularyPage.renderCards();
      }
    });

    btnPrev.addEventListener('click', () => {
      if (VocabularyPage.currentPage > 0) {
        VocabularyPage.currentPage -= 1;
        if (VocabularyPage.currentPage > 0) {
          btnNext.disabled = false;
          btnLast.disabled = false;
          btnFirst.disabled = false;
          btnPrev.disabled = false;
        } else {
          btnNext.disabled = false;
          btnLast.disabled = false;
          btnFirst.disabled = true;
          btnPrev.disabled = true;
        }
        VocabularyPage.showPageNumber();
        VocabularyPage.renderCards();
      }
    });

    btnNext.addEventListener('click', () => {
      if (VocabularyPage.currentPage < 29) {
        VocabularyPage.currentPage += 1;
        if (VocabularyPage.currentPage < 29) {
          btnNext.disabled = false;
          btnLast.disabled = false;
          btnFirst.disabled = false;
          btnPrev.disabled = false;
        } else {
          btnNext.disabled = true;
          btnLast.disabled = true;
          btnFirst.disabled = false;
          btnPrev.disabled = false;
        }
        VocabularyPage.showPageNumber();
        VocabularyPage.renderCards();
      }
    });

    cards?.addEventListener('click', (e) => {
      listControlButtons(e);
    });
  }
}
