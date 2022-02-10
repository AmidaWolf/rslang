import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { setElementHeight } from '../../../shared/helpers/setElementHeight';

function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class MainPage implements Page {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    setElementHeight();

    removeLoading();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}
