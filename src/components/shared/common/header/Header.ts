import { RoutesPath, routesText } from '../../../app/routes';
import baseHTML from './baseHTML';
import { renderSources } from '../../helpers/renderSources';

async function drawContent() {
  const headerWrapper = <HTMLElement>document.querySelector('.header-wrapper');

  const logoWrapper = document.createElement('a');
  logoWrapper.className = 'logo-wrapper';
  logoWrapper.href = `/#${RoutesPath.START}`;
  const logo = await renderSources.renderImage(
    './../../../assets/logo.png',
    'RS Lang logo'
  );
  logo.className = 'logo';
  logo.width = 180;
  logo.height = 50;
  logoWrapper.appendChild(logo);

  const nav = document.createElement('nav');
  nav.className = 'nav';

  const menuList = document.createElement('ul');
  menuList.className = 'header-menu';
  const pathList = Object.values(RoutesPath);
  for (let i = 0; i < pathList.length; i += 1) {
    if (pathList[i] !== RoutesPath.AUTHORIZATION) {
      const menuItem = document.createElement('li');
      menuItem.className = 'header-menu__item';
      const menuRef = document.createElement('a');
      menuRef.className = 'header-menu__link';
      menuRef.href = `/#${pathList[i]}`;
      menuRef.innerText = routesText[pathList[i]];

      menuItem.appendChild(menuRef);
      menuList.appendChild(menuItem);
    }
  }
  nav.appendChild(menuList);

  const login = document.createElement('a');
  login.className = 'login button';
  login.href = `/#${RoutesPath.AUTHORIZATION}`;
  login.innerText = routesText[RoutesPath.AUTHORIZATION];

  headerWrapper.append(logoWrapper, nav, login);
}

export class Header {
  async renderHTML() {
    return baseHTML;
  }

  async afterRender() {
    await drawContent();
  }
}
