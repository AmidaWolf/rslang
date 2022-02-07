import baseHTML from './baseHTML';
import { renderSources } from '../../helpers/renderSources';

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

  const rsLogo = await renderSources.renderImage(
    './../../../assets/rs_school_js.svg',
    'RS Lang logo'
  );
  rsLogo.className = 'rs-logo';
  rsLogo.height = 50;
  rsLogoWrapper.appendChild(rsLogo);

  const developersList = document.createElement('ul');
  developersList.className = 'developers-list';

  Object.entries(developersLinks).forEach(([name, link]) => {
    const developerItem = document.createElement('li');
    developerItem.className = 'developers-list__item';
    const developerLink = document.createElement('a');
    developerLink.className = 'developers-list__link';
    developerLink.href = link;
    developerLink.innerText = name;

    developerItem.appendChild(developerLink);
    developersList.appendChild(developerItem);
  });

  const copyright = document.createElement('p');
  copyright.className = 'copyright';
  copyright.innerText = '©2021 RSLang';

  footerWrapper.append(rsLogoWrapper, developersList, copyright);
}

export class Footer {
  async renderHTML() {
    return baseHTML;
  }

  async afterRender() {
    return drawContent();
  }
}
