import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { AudiogamePage } from '../AudiogamePage/AudiogamePage';
import { SprintgamePage } from '../SprintgamePage/SprintgamePage';

async function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class MinigamesPage implements Page {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    removeLoading();

    AudiogamePage.level = 0;

    const selectAudio = document.querySelectorAll(
      'input[name="select-audio"]'
    ) as NodeListOf<HTMLInputElement>;

    selectAudio.forEach((el) => {
      el.addEventListener('change', (el2) => {
        const target = el2.target as HTMLInputElement;
        AudiogamePage.level = +target.value - 1;
      });
    });

    SprintgamePage.level = 0;

    const selectSprint = document.querySelectorAll(
      'input[name="select-sprint"]'
    ) as NodeListOf<HTMLInputElement>;

    selectSprint.forEach((el) => {
      el.addEventListener('change', (el2) => {
        const target = el2.target as HTMLInputElement;
        SprintgamePage.level = +target.value - 1;
      });
    });
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}
