import { Router } from './components/app/router/router';

import './reset.scss';
import './global.scss';
import './assets/fonts/fonts.css';
import './components/view/pages/MainPage/MainPage.scss';
import './components/shared/component/header/Header.scss';
import './components/shared/component/modal/Modal.scss';

const router = new Router();
window.addEventListener('hashchange', router.rout);
window.addEventListener('load', router.rout);
