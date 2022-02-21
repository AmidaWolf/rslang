import baseHTML from './baseHTML';
import { renderSources } from '../../helpers/renderSources';
import { RoutesPath } from '../../../app/RoutesPath';

const developersLinks = {
  'insane-idea': 'https://github.com/insane-idea',
  'EVG777-prog': 'https://github.com/EVG777-prog',
  AmidaWolf: 'https://github.com/AmidaWolf',
};

async function drawContent() {
  const footerWrapper = <HTMLElement>document.querySelector('.footer-wrapper');

  const rsLogoWrapper = document.createElement('a');
  rsLogoWrapper.className = 'rs-logo-wrapper';
  rsLogoWrapper.href = 'https://rs.school/js/';
  rsLogoWrapper.target = '_blank';
  rsLogoWrapper.rel = 'noopener norefferer';

  const rsLogo = await renderSources.renderImage(
    './../../../assets/rs_school_js.svg',
    'RS Lang logo'
  );
  rsLogo.className = 'rs-logo';
  rsLogo.height = 50;
  rsLogoWrapper.appendChild(rsLogo);

  const developersInfo = document.createElement('div');
  developersInfo.className = 'developers-info';

  const developersList = document.createElement('ul');
  developersList.className = 'developers-list';

  Object.entries(developersLinks).forEach(([name, link]) => {
    const developerItem = document.createElement('li');
    developerItem.className = 'developers-list__item';
    const developerLink = document.createElement('a');
    developerLink.className = 'developers-list__link link';
    developerLink.href = link;
    developerLink.innerText = name;
    developerLink.target = '_blank';
    developerLink.rel = 'noopener norefferer';

    developerItem.appendChild(developerLink);
    developersList.appendChild(developerItem);
  });

  const developersButton = document.createElement('a');
  developersButton.className = 'developers-button button';
  developersButton.href = `/#${RoutesPath.DEVELOPERS}`;
  developersButton.innerText = 'Learn more about development';

  developersInfo.append(developersList, developersButton);

  const copyright = document.createElement('p');
  copyright.className = 'copyright';
  copyright.innerText = '©2021 RSLang';

  footerWrapper.append(rsLogoWrapper, developersInfo, copyright);
}

export class Footer {
  async renderHTML() {
    return baseHTML;
  }

  async afterRender() {
    return drawContent();
  }
}
