import { AppView } from '../../AppView';
import { loadSources } from '../../../shared/utils/loadSources';

async function returnHTML() {
  return loadSources.loadHTML(
    './components/view/pages/ErrorPage/ErrorPage.html'
  );
}

function renderFunc() {
  const title = <HTMLElement>document.querySelector('.error-title');
  title.textContent = 'This page not found';
}

export class ErrorPage extends AppView {
  constructor() {
    super(returnHTML, renderFunc);
  }
}
