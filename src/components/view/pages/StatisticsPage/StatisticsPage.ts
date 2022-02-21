import ServerApi from '../../../shared/utils/serverApi';
import { Page } from '../../Page';
import { Stat } from '../../../types';
import baseHTML from './baseHTML';

async function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class StatisticsPage implements Page {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    removeLoading();
    const stat = await StatisticsPage.getStatistic();
    console.log(stat);
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }

  static async getStatistic(): Promise<Stat> {
    const userId = localStorage.getItem('userId') as string;

    const wordsUser = await ServerApi.getUserWords(userId);

    const arrSprint: string[] = [];
    const arrAudio: string[] = [];
    const arrHard: string[] = [];
    const arrLearnt: boolean[] = [];
    wordsUser.forEach((el) => {
      arrSprint.push(el.optional.sprint);
      arrAudio.push(el.optional.audio);
      arrLearnt.push(el.optional.learnt);
      if (!el.optional.learnt) {
        arrHard.push(el.difficulty);
      }
    });

    const strSprint = arrSprint.reduce((sum, el) => sum + el.slice(1), '');
    const strAudio = arrAudio.reduce((sum, el) => sum + el.slice(1), '');
    const stat = {
      allWords: 0,
      hardWords: 0,
      easyWords: 0,
      lerntWords: 0,
      sprint: {
        all: 0,
        win: 0,
        lose: 0,
        winRate: 0,
      },
      audio: {
        all: 0,
        win: 0,
        lose: 0,
        winRate: 0,
      },
    };

    stat.sprint.all = strSprint.length;
    stat.sprint.win = strSprint.split('').filter((el) => el === '1').length;
    stat.sprint.lose = stat.sprint.all - stat.sprint.win;
    stat.sprint.winRate =
      Math.floor((stat.sprint.win / stat.sprint.all) * 100 * 100) / 100;

    stat.audio.all = strAudio.length;
    stat.audio.win = strAudio.split('').filter((el) => el === '1').length;
    stat.audio.lose = stat.audio.all - stat.audio.win;
    stat.audio.winRate =
      Math.floor((stat.audio.win / stat.audio.all) * 100 * 100) / 100;

    stat.lerntWords = arrLearnt.filter((el) => el === true).length;
    stat.hardWords = arrHard.filter((el) => el === 'hard').length;
    stat.easyWords = arrHard.filter((el) => el === 'easy').length;
    stat.allWords = stat.lerntWords + stat.hardWords + stat.easyWords;

    return stat;
  }
}
