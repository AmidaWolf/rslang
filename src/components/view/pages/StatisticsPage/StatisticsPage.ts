import { AppView } from '../../AppView';
import { loadSources } from '../../../shared/helpers/loadSources';

async function returnHTML() {
  return loadSources.loadHTML(
    './components/view/pages/StatisticsPage/StatisticsPage.html'
  );
}

async function renderFunc() {
  const loading = <HTMLElement>document.querySelector('.loading');

  loading.classList.add('visibility-hidden');
}

export class StatisticsPage extends AppView {
  constructor() {
    super(returnHTML, renderFunc);
  }
}
