import ServerApi from '../utils/serverApi';

export function getArrayFromSet(set: Set<unknown>): unknown[] {
  return Array.from(set);
}

export function getStringFromSet(set: Set<unknown>): string {
  return Array.from(set).join(';');
}

export function getArrayFromString(string: string) {
  return string.split(';');
}

export function getSetFromString(string: string) {
  const array = getArrayFromString(string);
  return new Set(array);
}

export function getSetFromArray(array: string[] | never[]) {
  return new Set(array);
}

export async function getRemoteDifficultSet(
  userId: string
): Promise<Set<unknown>> {
  const set = new Set();
  await ServerApi.getSettings(userId).then((settings) => {
    const { difficult } = settings.optional;
    if (difficult) {
      const array = difficult.split(';');
      array.forEach(async (id) => {
        set.add('difficult');
        set.add(id);
      });
    }
  });
  return set;
}

export async function getRemoteLearntSet(
  userId: string
): Promise<Set<unknown>> {
  const set = new Set();
  await ServerApi.getSettings(userId).then((settings) => {
    const { learnt } = settings.optional;
    if (learnt) {
      const array = learnt.split(';');
      array.forEach(async (id) => {
        set.add('learnt');
        set.add(id);
      });
    }
  });
  return set;
}

export function getLocalDifficultArr(userId: string): string[] | never[] {
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

  const finalArray = commonArray
    .filter((item, pos) => commonArray.indexOf(item) === pos)
    .filter((el) => el !== 'difficult' && el !== 'learnt');

  return finalArray;
}
