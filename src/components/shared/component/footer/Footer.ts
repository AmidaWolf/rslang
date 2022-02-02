import { AppView } from '../../../view/AppView';

const returnHtml = () => `<div class="footer-wrapper"></div>`;

function renderFunc() {
  const footerWrapper = <HTMLElement>document.querySelector('.footer-wrapper');
  footerWrapper.innerText = 'footer';
}

export class Footer extends AppView {
  constructor() {
    super(returnHtml, renderFunc);
  }
}
