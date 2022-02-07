import { Page } from '../../Page';
import baseHTML from './baseHTML';

function removeLoading() {
  const loading = <HTMLElement>document.querySelector('.loading');
  loading.classList.add('visibility-hidden');
}

export class DevelopersPage implements Page {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    removeLoading();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}