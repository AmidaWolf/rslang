import { App } from './components/app/app';

import './reset.scss';
import './global.scss';
import './assets/fonts/fonts.css';
import './components/view/pages/MainPage/MainPage.scss';
import './components/shared/common/header/Header.scss';
import './components/shared/common/modal/Modal.scss';

const app = new App();
window.addEventListener('hashchange', app.renderContent);
window.addEventListener('load', app.renderContent);
