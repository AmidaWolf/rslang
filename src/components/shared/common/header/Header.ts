import { RoutesPath, routesText } from '../../../app/routes';
import baseHTML from './baseHTML';
import { renderSources } from '../../helpers/renderSources';
import { AuthorizationModal } from '../../../view/pages/AuthorizationPage/AuthorizationModal';
import { AuthorizationPage } from '../../../view/pages/AuthorizationPage/AuthorizationPage';

async function createLogo(route: string) {
  const logoWrapper = document.createElement('a');
  logoWrapper.className = 'logo-wrapper';
  logoWrapper.href = `/#${route}`;
  const logo = await renderSources.renderImage(
    './../../../assets/logo.png',
    'RS Lang logo'
  );
  logo.className = 'logo';
  logo.width = 180;
  logo.height = 50;
  logoWrapper.appendChild(logo);
  return logoWrapper;
}

function createMenuItem(route: string): HTMLElement {
  const menuItem = document.createElement('li');
  menuItem.className = 'header-menu__item';
  const menuRef = document.createElement('a');
  menuRef.className = 'header-menu__link';
  menuRef.href = `/#${route}`;
  menuRef.innerText = routesText[route];

  menuItem.appendChild(menuRef);
  return menuItem;
}

function createHeaderButton(route: string): HTMLElement {
  const button = document.createElement('button');
  button.innerText = routesText[route];
  return button;
}

async function drawContent() {
  const authorizationModal = new AuthorizationModal();
  const authorizationPage = new AuthorizationPage();

  const pathList = Object.values(RoutesPath);
  const headerWrapper = <HTMLElement>document.querySelector('.header-wrapper');

  const nav = document.createElement('nav');
  const logo = await createLogo(RoutesPath.START);
  const menuList = document.createElement('ul');
  const textBook = createMenuItem(RoutesPath.TEXTBOOK);
  const login = createHeaderButton(RoutesPath.AUTHORIZATION);

  nav.className = 'nav';
  menuList.className = 'header-menu';
  login.className = 'login button login-btn';

  pathList.forEach((navItem) => {
    if (
      navItem !== RoutesPath.AUTHORIZATION &&
      navItem !== RoutesPath.DEVELOPERS &&
      navItem !== RoutesPath.TEXTBOOK
    ) {
      const item = createMenuItem(navItem);
      menuList.appendChild(item);
    }
  });

  menuList.appendChild(textBook);
  nav.appendChild(menuList);

  headerWrapper.append(logo, nav, login);
  await authorizationModal.run(login).then(() => {
    authorizationPage.run();
  });
}

export class Header {
  async renderHTML() {
    return baseHTML;
  }

  async afterRender() {
    await drawContent();
  }
}
