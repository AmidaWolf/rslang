import { App } from './components/app/app';

import './reset.scss';
import './global.scss';
import './assets/fonts/fonts.css';
import './components/view/pages/MainPage/MainPage.scss';
import './components/shared/common/header/Header.scss';
import './components/shared/common/modal/Modal.scss';
import './components/view/pages/TextbookPage/TextbookPage.scss';
import './components/view/pages/AudiogamePage/AudiogamePage.scss';

const app = new App();
app.run();

window.addEventListener('hashchange', App.renderContent);
// window.addEventListener('load', app.run);
