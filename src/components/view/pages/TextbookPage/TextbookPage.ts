import { AppView } from '../../AppView';
import { loadSources } from '../../../shared/utils/loadSources';

async function returnHTML() {
  return loadSources.loadHTML(
    './components/view/pages/TextbookPage/TextbookPage.html'
  );
}

async function renderFunc() {
  const loading = <HTMLElement>document.querySelector('.loading');

  loading.classList.add('visibility-hidden');
}

export class TextbookPage extends AppView {
  constructor() {
    super(returnHTML, renderFunc);
  }
}
