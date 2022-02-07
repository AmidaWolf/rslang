import ServerApi from '../../../shared/utils/serverApi';
import { WordType } from '../../../types';
import { Page } from '../../Page';
import baseHTML from './baseHTML';

async function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class AudiogamePage implements Page {
  container: HTMLElement;

  private static level = 0;

  private static arrayWords: WordType[] = [];

  private static arrayIndexGameWords: number[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    removeLoading();

    const arrayPromise: Promise<WordType[]>[] = [];
    for (let i = 0; i <= 29; i += 1) {
      arrayPromise.push(ServerApi.getWords(AudiogamePage.level, i));
    }
    AudiogamePage.arrayWords = (await Promise.all(arrayPromise)).flat();
    console.log(AudiogamePage.arrayWords);

    while (AudiogamePage.arrayIndexGameWords.length < 20) {
      const result = AudiogamePage.getIndexRandomWord();
      if (!AudiogamePage.arrayIndexGameWords.includes(result))
        AudiogamePage.arrayIndexGameWords.push(result);
    }
    console.log(AudiogamePage.arrayIndexGameWords);

  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  private static getIndexRandomWord(): number {
    return Math.floor(Math.random() * AudiogamePage.arrayWords.length);
  }
}
