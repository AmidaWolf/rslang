import { RoutesPath, routesText } from '../../../app/routes';
import baseHTML from './baseHTML';
import { renderSources } from '../../helpers/renderSources';
import { AuthorizationModal } from '../../../view/pages/AuthorizationPage/AuthorizationModal';
import { AuthorizationPage } from '../../../view/pages/AuthorizationPage/AuthorizationPage';

async function drawContent() {
  const authorizationModal = new AuthorizationModal();
  const authorizationPage = new AuthorizationPage();
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
    if (
      pathList[i] !== RoutesPath.AUTHORIZATION &&
      pathList[i] !== RoutesPath.DEVELOPERS
    ) {
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

  const login = document.createElement('button');
  login.className = 'login button login-btn';
  login.innerText = routesText[RoutesPath.AUTHORIZATION];

  headerWrapper.append(logoWrapper, nav, login);
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
