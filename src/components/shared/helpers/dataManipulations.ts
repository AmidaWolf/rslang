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

export async function getDifficultWordsSet(
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

export async function getLearntWordsSet(userId: string): Promise<Set<unknown>> {
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
