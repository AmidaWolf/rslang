import { AppView } from '../../AppView';
import { loadSources } from '../../../shared/helpers/loadSources';

async function returnHTML() {
  return loadSources.loadHTML(
    './components/view/pages/MinigamesPage/MinigamesPage.html'
  );
}

async function renderFunc() {
  const loading = <HTMLElement>document.querySelector('.loading');

  loading.classList.add('visibility-hidden');
}

export class MinigamesPage extends AppView {
  constructor() {
    super(returnHTML, renderFunc);
  }
}
