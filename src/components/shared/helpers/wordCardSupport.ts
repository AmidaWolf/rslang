import ServerApi from '../utils/serverApi';
import {
  getStringFromSet,
  getSetFromString,
  getRemoteDifficultSet,
  getRemoteLearntSet,
  getLocalDifficultArr,
  getLocalLearntArr,
  getStringFromArray,
} from './dataManipulations';

//* Local updates

//* Before it was called in serverWordsUpdate on the first app load only
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
  if (className.includes('difficult')) {
    if (!button.classList.contains(className)) {
      button.classList.add(className);
      set.add(wordId);
      localStorage.setItem('difficultWords', getStringFromSet(set));
    } else {
      button.classList.remove(className);
      set.delete(wordId);
      localStorage.setItem('difficultWords', getStringFromSet(set));
    }
  }

  if (className.includes('learnt')) {
    if (!button.classList.contains(className)) {
      button.classList.add(className);
      set.add(wordId);
      localStorage.setItem('learntWords', getStringFromSet(set));
    } else {
      button.classList.remove(className);
      set.delete(wordId);
      localStorage.setItem('learntWords', getStringFromSet(set));
    }
  }
}

export function toggleDifficultBtn(userId: string, wordId: string | undefined) {
  const difficultWordsString = localStorage.getItem('difficultWords');
  const className = 'difficult-active';

  if (userId) {
    if (difficultWordsString) {
      const set = getSetFromString(difficultWordsString);
      const difficultBtn = <HTMLElement>(
        document
          .querySelector(`div[data-id="${wordId}"]`)
          ?.querySelector(`.difficult-word`)
      );
      updateWordCondition(difficultBtn, className, set, wordId);
    } else {
      const set = new Set(['difficult']);
      const difficultBtn = <HTMLElement>(
        document
          .querySelector(`div[data-id="${wordId}"]`)
          ?.querySelector(`.difficult-word`)
      );
      updateWordCondition(difficultBtn, className, set, wordId);
    }
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
  } else {
    const set = new Set(['learnt']);
    const learntBtn = <HTMLElement>(
      document
        .querySelector(`div[data-id="${wordId}"]`)
        ?.querySelector(`.learnt-word`)
    );
    updateWordCondition(learntBtn, className, set, wordId);
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

//* This one is not used but can be in both words pages (only updates buttons if they are presented on page and LS)

export function storageControlButtonsUpdate(container: HTMLElement) {
  const userId = localStorage.getItem('userId');
  if (userId) {
    const difficultWordsLocalArr = getLocalDifficultArr(userId);
    const learntWordsLocalArr = getLocalLearntArr(userId);

    difficultWordsLocalArr.forEach((wordId) => {
      const difficultBtn = <HTMLElement>(
        container
          .querySelector(`div[data-id="${wordId}"]`)
          ?.querySelector(`.difficult-word`)
      );

      if (difficultBtn) {
        difficultBtn.classList.add('difficult-active');
      }
    });

    learntWordsLocalArr.forEach((wordId) => {
      const learntBtn = <HTMLElement>(
        container
          .querySelector(`div[data-id="${wordId}"]`)
          ?.querySelector(`.learnt-word`)
      );

      if (learntBtn) {
        learntBtn.classList.add('learnt-active');
      }
    });
  }
}

//* Server updates

//* extend serverWordsUpdate() and add new words check there
export async function updateLocalWordsSettings() {
  const userId = localStorage.getItem('userId');

  if (userId) {
    const difficultWordsSet = await getRemoteDifficultSet(userId);
    const learntWords = await getRemoteLearntSet(userId);

    localStorage.setItem('difficultWords', getStringFromSet(difficultWordsSet));
    localStorage.setItem('learntWords', getStringFromSet(learntWords));
  }
}

export async function updateRemoteWordsSettings() {
  const userId = localStorage.getItem('userId');

  if (userId) {
    const previousSettings = await ServerApi.getSettings(userId);
    const difficultWords: string | null =
      localStorage.getItem('difficultWords');
    const learntWords: string | null = localStorage.getItem('learntWords');

    const options = {
      wordsPerDay: previousSettings.wordsPerDay,
      optional: {
        difficult: `difficult;${difficultWords}`,
        learnt: `learnt;${learntWords}`,
      },
    };

    await ServerApi.updateSettings(userId, options).then(() => {
      // console.log('localStorage clear');
    });
  }
}

export async function updateEasyDifficultStorage(
  difficultArray: string[],
  easyArray: string[]
) {
  localStorage.setItem('difficultWords', getStringFromArray(difficultArray));
  localStorage.setItem('easyWords', getStringFromArray(easyArray));
}

export async function easyUpdater(userId: string, wordId: string) {
  await ServerApi.getUserWord(userId, wordId).then(async (userWord) => {
    console.log('userWordEasy1111111: ', userWord);
    if (userWord.optional) {
      const refreshedWordData = {
        id: userWord.id,
        wordId: userWord.wordId,
        difficulty: 'easy',
        optional: {
          sprint: userWord.optional.sprint,
          audio: userWord.optional.audio,
          allGames: userWord.optional.allGames,
          learnt: userWord.optional.learnt,
        },
      };

      await ServerApi.updateUserWord(userId, wordId, refreshedWordData).then(
        (word2) => {
          console.log('userWordEasy2222222222: ', word2);
        }
      );
    }
  });
}

export async function difficultUpdater(userId: string, wordId: string) {
  await ServerApi.getUserWord(userId, wordId).then(async (userWord) => {
    console.log('userWordDifficult1111111: ', userWord);
    if (userWord.optional) {
      const refreshedWordData = {
        id: userWord.id,
        wordId: userWord.wordId,
        difficulty: 'difficult',
        optional: {
          sprint: userWord.optional.sprint,
          audio: userWord.optional.audio,
          allGames: userWord.optional.allGames,
          learnt: userWord.optional.learnt,
        },
      };

      await ServerApi.updateUserWord(userId, wordId, refreshedWordData).then(
        (word2) => {
          console.log('userWordDifficult222222222: ', word2);
        }
      );
    }
  });
}

export async function updateDifficultWords() {
  const userId = localStorage.getItem('userId');

  if (userId) {
    const cards = Array.from(
      <NodeListOf<HTMLElement>>document.querySelectorAll('.card-container')
    );
    const localArray = getLocalDifficultArr(userId);
    const presentedWords: string[] = [];
    const difficultFinal: string[] = [];
    const easyFinal: string[] = [];

    cards.forEach((card) => {
      const cardId = card.dataset.id;
      if (cardId) {
        presentedWords.push(cardId);
      }
    });

    presentedWords.forEach((wordId) => {
      if (localArray.includes(wordId)) {
        difficultFinal.push(wordId);
      } else {
        easyFinal.push(wordId);
      }
    });

    const arrayOfDifficultPromises: Promise<void>[] = difficultFinal.map(
      async (wordId) => {
        await difficultUpdater(userId, wordId);
      }
    );

    const arrayOfEasyPromises: Promise<void>[] = easyFinal.map(
      async (wordId) => {
        await easyUpdater(userId, wordId);
      }
    );

    await Promise.all(arrayOfDifficultPromises);
    await Promise.all(arrayOfEasyPromises);
    // await updateRemoteWordsSettings();
    // updateEasyDifficultStorage(difficultFinal, easyFinal);
  }
}

// export async function updateNewWords() {}

// export async function updateLearntWords() {}

export async function listWordsSettingsUpdate() {
  // TODO: add listener on window.location.reload();
  const logOutBtn = document.querySelector('.log-out');

  window.addEventListener('hashchange', updateDifficultWords);
  window.addEventListener('hashchange', updateRemoteWordsSettings);
  window.addEventListener('beforeunload', updateRemoteWordsSettings);
  logOutBtn?.addEventListener('click', updateRemoteWordsSettings);
}
