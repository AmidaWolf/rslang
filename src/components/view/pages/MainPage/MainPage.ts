import { Page } from '../../Page';
import baseHTML from './baseHTML';

async function removeLoading() {
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
    const header = <HTMLElement>document.querySelector('.header');
    const footer = <HTMLElement>document.querySelector('.footer');
    const main = <HTMLElement>document.querySelector('.main');

    const headerHeight = header.getBoundingClientRect().height;
    const footerHeight = footer.getBoundingClientRect().height;
    main.style.minHeight = `calc(100vh - ${headerHeight + footerHeight}px)`;

    await removeLoading();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}
