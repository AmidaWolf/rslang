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

    SprintgamePage.level = 0;

    const btnStartAudioGame = document.querySelector(
      '.minigames__btn-start_audio'
    );
    const btnStartSprintGame = document.querySelector(
      '.minigames__btn-start_sprint'
    );

    btnStartAudioGame?.addEventListener('click', () => {
      const selectAudio = document.querySelectorAll(
        '[name="select-audio"]'
      ) as NodeListOf<HTMLInputElement>;
      selectAudio.forEach((el) => {
        if (el.checked) AudiogamePage.level = +el.value;
      });
    });

    btnStartSprintGame?.addEventListener('click', () => {
      const selectSPrint = document.querySelectorAll(
        '[name="select-sprint"]'
      ) as NodeListOf<HTMLInputElement>;
      selectSPrint.forEach((el) => {
        if (el.checked) SprintgamePage.level = +el.value;
      });
    });
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}
