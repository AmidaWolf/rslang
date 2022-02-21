import ServerApi from '../utils/serverApi';

export function getArrayFromSet(set: Set<unknown>): unknown[] {
  return Array.from(set);
}

export function getStringFromSet(set: Set<unknown>): string {
  return Array.from(set).join(';');
}

export function getArrayFromString(string: string) {
  const arr = string.split(';');
  return arr.filter(
    (el) => el !== 'learnt' && el !== 'difficult' && el !== 'null' && el !== ''
  );
}

export function getSetFromString(string: string) {
  const array = getArrayFromString(string);
  return new Set(array);
}

export function getSetFromArray(array: string[] | never[]) {
  return new Set(array);
}

export function getStringFromArray(array: string[]) {
  return array.join(';');
}

export async function getRemoteDifficultSet(
  userId: string
): Promise<Set<unknown>> {
  const set = new Set(['difficult']);
  await ServerApi.getSettings(userId).then((settings) => {
    const { difficult } = settings.optional;
    if (difficult) {
      const array = difficult.split(';');
      array.forEach(async (id) => {
        set.add(id);
      });
    }
  });
  return set;
}

export async function getRemoteLearntSet(
  userId: string
): Promise<Set<unknown>> {
  const set = new Set(['learnt']);
  await ServerApi.getSettings(userId).then((settings) => {
    const { learnt } = settings.optional;
    if (learnt) {
      const array = learnt.split(';');
      array.forEach(async (id) => {
        set.add(id);
      });
    }
  });
  return set;
}

export function getLocalDifficultArr(userId: string): string[] {
  const difficultWords: string | null = localStorage.getItem('difficultWords');
  let difficultArray: never[] | string[] = [];

  if (userId && difficultWords) {
    difficultArray = getArrayFromString(difficultWords);
  }
  return difficultArray;
}

export function getLocalLearntArr(userId: string): string[] | never[] {
  const learntWords: string | null = localStorage.getItem('learntWords');
  let learntArray: never[] | string[] = [];

  if (userId && learntWords) {
    learntArray = getArrayFromString(learntWords);
  }
  return learntArray;
}

export function getUniqueLocalWordsArray() {
  const userId = localStorage.getItem('userId');
  const commonArray: string[] = [];

  if (userId) {
    const difficultWordsArray = getLocalDifficultArr(userId);
    const learntWordsArray = getLocalLearntArr(userId);

    difficultWordsArray.forEach((id) => {
      commonArray.push(id);
    });

    learntWordsArray.forEach((id) => {
      commonArray.push(id);
    });
  }

  const finalArray = commonArray.filter(
    (item, pos) => commonArray.indexOf(item) === pos
  );

  return finalArray;
}

// 1. Get (difficult & learnt & new) words from settings
// 2. Change words via cards locally
// 3. Update settings on hashchange (if no such userWord -> create)

// 4. Change words in games
// 5. Update all userWords after game finish
// 6. While playing need to create arrays containing results and after game's finished - update userWords & settings
