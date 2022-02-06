import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { getCardWord } from './card';
import ServerApi from '../../../shared/utils/serverApi';

async function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class TextbookPage implements Page {
  container: HTMLElement;

  private static currentPage = 0;

  private static currentGroup = 0;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    removeLoading();
    TextbookPage.addEventsListnersBtns();
    await TextbookPage.renderCards();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  static async renderCards(): Promise<void> {
    const cards = document.querySelector('.cards');

    if (cards) cards.innerHTML = '';

    const wordsArray = await ServerApi.getWords(
      TextbookPage.currentGroup,
      TextbookPage.currentPage
    );

    wordsArray.forEach((el) => {
      if (cards) cards.innerHTML += getCardWord(el);
    });

    const btnsSound = document.querySelectorAll('.btn-sound');

    btnsSound.forEach((el) => {
      const target = el as HTMLElement & { dataset: Record<string, string> };
      const { id } = target.dataset;

      const audio = document.querySelector(
        `audio[data-id="${id}"`
      ) as HTMLAudioElement;

      if (audio) {
        el.addEventListener('click', () => {
          audio.currentTime = 0;
          audio.play();
        });
      }
    });
  }

  static addEventsListnersBtns(): void {
    const btnFirst = document.querySelector('#btn-first');
    const btnPrev = document.querySelector('#btn-prev');
    const btnNext = document.querySelector('#btn-next');
    const btnLast = document.querySelector('#btn-last');
    const selectGroup = document.querySelector('#group-words');

    selectGroup?.addEventListener('change', (el) => {
      const target = el.target as HTMLElement & { selectedIndex: string };
      TextbookPage.currentGroup = +target.selectedIndex;
      TextbookPage.renderCards();
    });

    btnFirst?.addEventListener('click', () => {
      if (TextbookPage.currentPage !== 0) {
        TextbookPage.currentPage = 0;
        TextbookPage.showPageNumber();
        TextbookPage.renderCards();
      }
    });

    btnLast?.addEventListener('click', () => {
      if (TextbookPage.currentPage !== 29) {
        TextbookPage.currentPage = 29;
        TextbookPage.showPageNumber();
        TextbookPage.renderCards();
      }
    });

    btnPrev?.addEventListener('click', () => {
      if (TextbookPage.currentPage > 0) {
        TextbookPage.currentPage -= 1;
        TextbookPage.showPageNumber();
        TextbookPage.renderCards();
      }
    });

    btnNext?.addEventListener('click', () => {
      if (TextbookPage.currentPage < 29) {
        TextbookPage.currentPage += 1;
        TextbookPage.showPageNumber();
        TextbookPage.renderCards();
      }
    });
  }

  static showPageNumber(): void {
    const pageText = document.querySelector('#page-text span');
    if (pageText) pageText.textContent = String(TextbookPage.currentPage + 1);
  }
}
