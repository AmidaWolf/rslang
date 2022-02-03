export enum UrlI {
  baseUrl = 'https://rs-school-learn-words.herokuapp.com',
  words = '/words',
  users = '/users',
  signIn = '/signin',
}

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export const Loader = {
  async errorHandler(res: Response) {
    if (res.status === 401 || res.status === 404) {
      console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
    }
    return Promise.resolve(res);
  },

  errorHandlerConsole(res: Response) {
    if (res.status === 401 || res.status === 404) {
      console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
    }
  },

  async getUser(id: string): Promise<void> {
    return fetch(`${UrlI.baseUrl + UrlI.users}/${id}`)
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error(err));
  },

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    return fetch(`${UrlI.baseUrl + UrlI.users}`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error(err));
  },

  async getWords(group: number, page: number): Promise<IWord[]> {
    const response = await fetch(
      `${UrlI.baseUrl + UrlI.words}?group=${group}&page=${page}`
    );
    this.errorHandlerConsole(response);
    if (!response.ok) return [];
    const words = await response.json();
    return words;
  },

  async getWord(id: string): Promise<IWord | null> {
    const response = await fetch(`${UrlI.baseUrl + UrlI.words}/${id}`);
    this.errorHandlerConsole(response);
    if (!response.ok) return null;
    const word = await response.json();
    return word;
  },
};
