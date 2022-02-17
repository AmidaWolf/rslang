import ServerApi from '../utils/serverApi';
import {
  getArrayFromSet,
  getStringFromSet,
  getArrayFromString,
  getSetFromString,
  getDifficultWordsSet,
  getLearntWordsSet,
} from './dataManipulations';

export async function firstControlButtonsUpdate(
  wordsIDsArray: unknown[],
  btn: string
) {
  const userId = localStorage.getItem('userId');

  if (userId) {
    wordsIDsArray.forEach((wordId) => {
      if (btn === 'difficult') {
        const difficultBtn = <HTMLElement>(
          document
            .querySelector(`div[data-id="${wordId}"]`)
            ?.querySelector(`.${btn}-word`)
        );

        if (difficultBtn) {
          difficultBtn.classList.add(`${btn}-active`);
        }
      }

      if (btn === 'learnt') {
        const learntBtn = <HTMLElement>(
          document
            .querySelector(`div[data-id="${wordId}"]`)
            ?.querySelector(`.${btn}-word`)
        );

        if (learntBtn) {
          learntBtn.classList.add(`${btn}-active`);
        }
      }
    });
  }
}

export function updateWordCondition(
  button: HTMLElement,
  className: string,
  set: Set<unknown>,
  wordId: string | undefined
) {
  if (!button.classList.contains(className)) {
    button.classList.add(className);
    set.add(wordId);
  } else {
    button.classList.remove(className);
    set.delete(wordId);
  }
}

export function toggleDifficultBtn(userId: string, wordId: string | undefined) {
  const difficultWordsString = localStorage.getItem('difficultWords');
  const className = 'difficult-active';

  if (userId && difficultWordsString) {
    const set = getSetFromString(difficultWordsString);
    const difficultBtn = <HTMLElement>(
      document
        .querySelector(`div[data-id="${wordId}"]`)
        ?.querySelector(`.difficult-word`)
    );

    updateWordCondition(difficultBtn, className, set, wordId);
    localStorage.setItem('difficultWords', getStringFromSet(set));
  }
}

export function toggleLearntBtn(userId: string, wordId: string | undefined) {
  const learntWordsString = localStorage.getItem('learntWords');
  const className = 'learnt-active';

  if (userId && learntWordsString) {
    const set = getSetFromString(learntWordsString);
    const learntBtn = <HTMLElement>(
      document
        .querySelector(`div[data-id="${wordId}"]`)
        ?.querySelector(`.learnt-word`)
    );
    updateWordCondition(learntBtn, className, set, wordId);
    localStorage.setItem('learntWords', getStringFromSet(set));
  }
}

export async function listControlButtons(e: Event) {
  const userId = localStorage.getItem('userId');
  const clickTarget = e.target as HTMLElement;

  if (!clickTarget.classList.contains('cards')) {
    const currentCardId = (<HTMLElement>clickTarget.closest('.card-container'))
      .dataset.id;

    const isDifficultButtonClosest = <HTMLElement>(
      clickTarget.closest('button[data-button="difficult"]')
    );
    const isLearntButtonClosest = <HTMLElement>(
      clickTarget.closest('button[data-button="learnt"]')
    );

    if (isDifficultButtonClosest && userId) {
      toggleDifficultBtn(userId, currentCardId);
    }
    if (isLearntButtonClosest && userId) {
      toggleLearntBtn(userId, currentCardId);
    }
  }
}

export async function serverWordsUpdate() {
  const userId = localStorage.getItem('userId');

  if (userId) {
    const difficultWordsSet = await getDifficultWordsSet(userId);
    const learntWords = await getLearntWordsSet(userId);
    const difficultWordsArray = getArrayFromSet(difficultWordsSet);
    const learntWordsArray = getArrayFromSet(learntWords);

    await firstControlButtonsUpdate(difficultWordsArray, 'difficult');
    await firstControlButtonsUpdate(learntWordsArray, 'learnt');

    localStorage.setItem('difficultWords', getStringFromSet(difficultWordsSet));
    localStorage.setItem('learntWords', getStringFromSet(learntWords));
  }
}

export async function storageControlButtonsUpdate() {
  const difficultWords: string | null = localStorage.getItem('difficultWords');
  const learntWords: string | null = localStorage.getItem('learntWords');

  if (difficultWords) {
    const array = getArrayFromString(difficultWords);

    array.forEach((wordId) => {
      const cards = <HTMLElement>document.querySelector('.cards');
      console.log('cards: ', cards);

      const currentCard = <HTMLElement>(
        cards.querySelector(`div[data-id="${wordId}"]`)
      );
      const difficultBtn = currentCard?.querySelector(`.difficult-word`);

      console.log('currentCard: ', currentCard);
      console.log('difficultBtn: ', difficultBtn);

      if (difficultBtn) {
        difficultBtn.classList.add('difficult-active');
      }
    });
  }

  if (learntWords) {
    const array = getArrayFromString(learntWords);
    array.forEach((wordId) => {
      const learntBtn = <HTMLElement>(
        document
          .querySelector(`div[data-id="${wordId}"]`)
          ?.querySelector(`.learnt-word`)
      );

      if (learntBtn) {
        learntBtn.classList.add('learnt-active');
      }
    });
  }
}

export async function updateWordsSettings() {
  const userId = localStorage.getItem('userId');

  if (userId) {
    ServerApi.getSettings(userId).then((settings) => {
      const difficultWords: string | null =
        localStorage.getItem('difficultWords');
      const learntWords: string | null = localStorage.getItem('learntWords');

      const options = {
        wordsPerDay: settings.wordsPerDay,
        optional: {
          difficult: `difficult;${difficultWords}`,
          learnt: `learnt;${learntWords}`,
        },
      };

      ServerApi.updateSettings(userId, options);
    });
  }
}

export function listWordsSettingsUpdate() {
  // TODO: add listener on window.location.reload();
  const logOutBtn = document.querySelector('.log-out');

  window.addEventListener('hashchange', updateWordsSettings);
  window.addEventListener('beforeunload', updateWordsSettings);
  logOutBtn?.addEventListener('click', updateWordsSettings);
}

// firstControlButtonsUpdate - called only in serverWordsUpdate. serverWordsUpdate is not being used now
