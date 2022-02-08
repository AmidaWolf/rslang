import { Page } from '../../Page';
import baseHTML from './baseHTML';
import { devInfo } from './developersText';
import { renderSources } from '../../../shared/helpers/renderSources';
import { setElementHeight } from '../../../shared/helpers/setElementHeight';

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
    const mainWrapper = <HTMLElement>(
      document.querySelector('.developers__wrapper')
    );

    const devCards = document.createElement('ul');
    devCards.className = 'dev-cards';

    for (let i = 0; i < devInfo.length; i += 1) {
      const cardItem = document.createElement('li');
      cardItem.className = 'dev-cards__item dev-card';

      // eslint-disable-next-line no-await-in-loop
      const avatar = await renderSources.renderImage(
        devInfo[i].linkToPhoto,
        devInfo[i].fullName
      );
      avatar.className = 'dev-card__avatar';

      const infoWrapper = document.createElement('div');
      infoWrapper.className = 'dev-card__info-wrapper';

      const devCardTitle = document.createElement('h2');
      devCardTitle.className = 'dev-card__title';

      const devLink = document.createElement('a');
      devLink.className = 'dev-link link';
      devLink.href = devInfo[i].github;
      devLink.target = '_blank';
      devLink.rel = 'noopener norefferer';
      devLink.innerText = devInfo[i].fullName;

      devCardTitle.appendChild(devLink);

      const devCardSubtitle = document.createElement('h3');
      devCardSubtitle.className = 'dev-card__subtitle';
      devCardSubtitle.innerText = devInfo[i].position;

      const devCardText = document.createElement('p');
      devCardText.className = 'dev-card__text';
      devCardText.innerText = devInfo[i].responsibility;

      const prLink = document.createElement('a');
      prLink.className = 'dev-card__pr-link link';
      prLink.href = devInfo[i].linkToPRs;
      prLink.innerText = "Click to see all PR's";
      prLink.target = '_blank';
      prLink.rel = 'noopener norefferer';

      infoWrapper.append(devCardTitle, devCardSubtitle, devCardText, prLink);
      cardItem.append(avatar, infoWrapper);

      devCards.appendChild(cardItem);
    }

    mainWrapper.append(devCards);

    setElementHeight();

    removeLoading();
  }

  async run() {
    await this.renderHTML().then(() => this.afterRender());
  }
}
