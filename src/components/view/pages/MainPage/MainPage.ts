import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { isUserAuthorized } from '../../../shared/helpers/isUserAuthorized';

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
    const vocabularyLink = <HTMLAnchorElement>(
      document.querySelector('#vocabularyLink')
    );
    const statisticsLink = <HTMLAnchorElement>(
      document.querySelector('#statisticsLink')
    );

    const noClick = (event) => {
      event.preventDefault();
    };

    if (!isUserAuthorized()) {
      vocabularyLink.title =
        'Need register or authenticate for look this functionality';
      vocabularyLink.addEventListener('click', noClick);
      statisticsLink.title =
        'Need register or authenticate for look this functionality';
      statisticsLink.addEventListener('click', noClick);
    } else {
      vocabularyLink.removeEventListener('click', noClick);
      statisticsLink.removeEventListener('click', noClick);
    }
    removeLoading();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}
