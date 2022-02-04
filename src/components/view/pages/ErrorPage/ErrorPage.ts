import { Page } from '../../Page';
import baseHTML from './baseHTML';

async function showError() {
  const title = <HTMLElement>document.querySelector('.error-title');
  title.textContent = 'This page not found';
}

export class ErrorPage implements Page {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async renderHTML() {
    this.container.innerHTML = baseHTML;
  }

  async afterRender() {
    showError();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}
