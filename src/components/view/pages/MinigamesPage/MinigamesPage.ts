import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { AudiogamePage } from '../AudiogamePage/AudiogamePage';
import { SprintgamePage } from '../SprintgamePage/SprintgamePage';
import { RoutesPath } from '../../../app/RoutesPath';
import { gameCheckerCard } from './gameCheckerCard';

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

    const games = [
      {
        gameName: 'audio',
        rout: RoutesPath.AUDIOGAME,
      },
      {
        gameName: 'sprint',
        rout: RoutesPath.SPRINTGAME,
      },
    ];

    const minigamesList = <HTMLElement>(
      document.querySelector('.minigames__games')
    );

    games.forEach((game) => {
      minigamesList.innerHTML += gameCheckerCard(game.gameName, game.rout);
    });

    const btnStartAudioGame = <HTMLButtonElement>(
      document.querySelector('.minigames__btn-start_audio')
    );

    const btnStartSprintGame = <HTMLButtonElement>(
      document.querySelector('.minigames__btn-start_sprint')
    );

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
