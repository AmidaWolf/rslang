import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { AudiogamePage } from '../AudiogamePage/AudiogamePage';
import { SprintgamePage } from '../SprintgamePage/SprintgamePage';
import { RoutesPath } from '../../../app/RoutesPath';

function removeLoading() {
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
    AudiogamePage.level = 0;

    SprintgamePage.level = 0;

    const buttonsAudioContainer = <HTMLElement>(
      document.querySelector('.audio-container')
    );
    const buttonsSprintContainer = <HTMLElement>(
      document.querySelector('.sprint-container')
    );

    const btnStartAudioGame = document.createElement('a');
    btnStartAudioGame.className = 'button minigames__btn-start_audio';
    btnStartAudioGame.href = `#${RoutesPath.AUDIOGAME}`;
    btnStartAudioGame.innerText = 'Start Game';

    const btnStartSprintGame = document.createElement('a');
    btnStartSprintGame.className = 'button minigames__btn-start_sprint';
    btnStartSprintGame.href = `#${RoutesPath.SPRINTGAME}`;
    btnStartSprintGame.innerText = 'Start Game';

    buttonsAudioContainer.appendChild(btnStartAudioGame);
    buttonsSprintContainer.appendChild(btnStartSprintGame);

    btnStartAudioGame.addEventListener('click', () => {
      const selectAudio = document.querySelectorAll(
        '[name="select-audio"]'
      ) as NodeListOf<HTMLInputElement>;
      selectAudio.forEach((el) => {
        if (el.checked) AudiogamePage.level = +el.value;
      });
    });

    btnStartSprintGame.addEventListener('click', () => {
      const selectSPrint = document.querySelectorAll(
        '[name="select-sprint"]'
      ) as NodeListOf<HTMLInputElement>;
      selectSPrint.forEach((el) => {
        if (el.checked) SprintgamePage.level = +el.value;
      });
    });

    removeLoading();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}
