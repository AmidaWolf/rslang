import { App } from './components/app/app';
import ServerApi from './components/shared/utils/serverApi';
// import IDB from './components/shared/utils/db';

import './reset.scss';
import './global.scss';
import './assets/fonts/fonts.css';
import './components/view/pages/MainPage/MainPage.scss';
import './components/shared/common/header/Header.scss';
import './components/shared/common/footer/Footer.scss';
import './components/shared/common/modal/Modal.scss';
import './components/view/pages/TextbookPage/TextbookPage.scss';
import './components/view/pages/VocabularyPage/VocabularyPage.scss';
import './components/view/pages/AudiogamePage/AudiogamePage.scss';
import './components/view/pages/DevelopersPage/DevelopersPage.scss';

const app = new App();
app.run();

window.addEventListener('hashchange', App.renderContent);
// window.addEventListener('load', app.run);

const options = {
  wordsPerDay: 1,
  optional: {
    difficult: '5e9f5ee35eb9e72bc21af4a1;5e9f5ee35eb9e72bc21af4a3',
    learnt:
      '5e9f5ee35eb9e72bc21af4a0;5e9f5ee35eb9e72bc21af4a2;5e9f5ee35eb9e72bc21af4a3',
  },
};

const wordBody = {
  difficulty: 'easy',
  optional: {},
};

const userId = localStorage.getItem('userId');
if (userId) {
  //   ServerApi.getSettings(userId).then((settings) => {
  //     console.log('settings: ', settings);
  //   });
    ServerApi.updateSettings(userId, options).then((settings) => {
      console.log('settings: ', settings);
    });
  //   ServerApi.createUserWord(userId, '5e9f5ee35eb9e72bc21af4a5', wordBody).then(
  //     (userWord) => console.log('userWord: ', userWord)
  //   );
  //   ServerApi.getUserWords(userId).then((userWord) =>
  //     console.log('userWord: ', userWord)
  //   );
  //   ServerApi.updateUserWord(userId, '5e9f5ee35eb9e72bc21af4a0', {
  //     difficulty: '0',
  //     optional: {
  //       learning: 'false',
  //       removed: 'false',
  //       liked: 'false',
  //       difficult: 'true',
  //       learnt: 'false',
  //     },
  //   });
  //   ServerApi.getUserWord(userId, '5e9f5ee35eb9e72bc21af4a2').then((word) => {
  //     console.log('word: ', word);
  //   });
  //   ServerApi.deleteUserWord(userId, '5e9f5ee35eb9e72bc21af4a2');
}

// const set = new Set();
// set.add('foo');
// set.add('zoo');
// console.log('set: ', set);

// const array = Array.from(set);
// const string = array.join(';');
// console.log(string.split(';'));
// const obj = { ...array };
// console.log(obj);

// For transferring data in obj use string + divider ';', in LS the same
// While operating with data - use new Set()
