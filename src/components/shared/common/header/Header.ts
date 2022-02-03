import { AppView } from '../../../view/AppView';
import { RoutesPath, routesText } from '../../../app/routes';

const returnHtml = () => `<div class="header-wrapper"></div>`;

function renderFunc() {
  const headerWrapper = <HTMLElement>document.querySelector('.header-wrapper');

  const nav = document.createElement('nav');
  nav.className = 'nav';

  const menuList = document.createElement('ul');
  menuList.className = 'header-menu';
  const pathList = Object.values(RoutesPath);
  for (let i = 0; i < pathList.length; i += 1) {
    const menuItem = document.createElement('li');
    menuItem.className = 'header-menu__item';
    const menuRef = document.createElement('a');
    menuRef.className = 'header-menu__link';
    menuRef.href = `/#${pathList[i]}`;
    menuRef.innerText = routesText[pathList[i]];

    menuItem.appendChild(menuRef);
    menuList.appendChild(menuItem);
  }
  nav.appendChild(menuList);

  headerWrapper.appendChild(nav);
}

export class Header extends AppView {
  constructor() {
    super(returnHtml, renderFunc);
  }
}
