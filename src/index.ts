import { App } from './components/app/app';

import './reset.scss';
import './global.scss';
import './assets/fonts/fonts.css';
import './components/view/pages/MainPage/MainPage.scss';
import './components/shared/common/header/Header.scss';
import './components/shared/common/footer/Footer.scss';
import './components/view/pages/TextbookPage/TextbookPage.scss';
import './components/view/pages/VocabularyPage/VocabularyPage.scss';
import './components/view/pages/AudiogamePage/AudiogamePage.scss';
import './components/view/pages/DevelopersPage/DevelopersPage.scss';
import './components/view/pages/AuthorizationPage/AuthorizationModal.scss';
import './components/view/pages/MinigamesPage/MinigamesPage.scss';
import './components/view/pages/SprintgamePage/SprintgamePage.scss';

const app = new App();
app.run();

window.addEventListener('hashchange', App.renderContent);
// window.addEventListener('load', app.run);
