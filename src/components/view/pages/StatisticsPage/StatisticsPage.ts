import ServerApi from '../../../shared/utils/serverApi';
import { Page } from '../../Page';
import { Stat } from '../../../types';
import baseHTML from './baseHTML';
import { wordsStatisticsCard } from './wordsStatisticsCard';
import { minigameStatisticsCard } from './minigameStatisticsCard';

function removeLoading() {
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
    const gamesStatistics = <HTMLElement>(
      document.querySelector('.games-statistics')
    );
    const wordsStatistics = <HTMLElement>(
      document.querySelector('.words-statistics')
    );

    const stat = await StatisticsPage.getStatistic();
    console.log(stat);

    const audioStatistics = minigameStatisticsCard(
      'AudioGame',
      stat.audio.all,
      stat.audio.winRate
    );
    const sprintStatistics = minigameStatisticsCard(
      'SprintGame',
      stat.sprint.all,
      stat.sprint.winRate
    );

    gamesStatistics.innerHTML = audioStatistics + sprintStatistics;
    wordsStatistics.innerHTML = wordsStatisticsCard(
      stat.allWords,
      stat.lerntWords,
      stat.hardWords,
      stat.winRateAll
    );
    removeLoading();
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
      winRateAll: 0,
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
      stat.sprint.all !== 0
        ? Math.round((stat.sprint.win / stat.sprint.all) * 100 * 100) / 100
        : 0;

    stat.audio.all = strAudio.length;
    stat.audio.win = strAudio.split('').filter((el) => el === '1').length;
    stat.audio.lose = stat.audio.all - stat.audio.win;
    stat.audio.winRate =
      stat.audio.all !== 0
        ? Math.round((stat.audio.win / stat.audio.all) * 100 * 100) / 100
        : 0;

    const gamesAll = stat.audio.all + stat.sprint.all;
    const winsAll = stat.audio.win + stat.sprint.win;

    stat.winRateAll = Math.round(((winsAll / gamesAll) * 100 * 100) / 100);

    stat.lerntWords = arrLearnt.filter((el) => el).length;
    stat.hardWords = arrHard.filter((el) => el === 'hard').length;
    stat.easyWords = arrHard.filter((el) => el === 'easy').length;
    stat.allWords = stat.lerntWords + stat.hardWords + stat.easyWords;

    return stat;
  }
}
