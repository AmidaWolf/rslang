// import { Page } from '../../../view/Page';
import baseHTML from './baseHTML';

async function drawContent() {
  const footerWrapper = <HTMLElement>document.querySelector('.footer-wrapper');
  footerWrapper.innerText = 'footer';
}

export class Footer {
  async renderHTML() {
    return baseHTML;
  }

  async afterRender() {
    return drawContent();
  }
}
