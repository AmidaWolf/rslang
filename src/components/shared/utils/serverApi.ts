import { WordType } from '../../types';

export default class ServerApi {
  static baseURL = 'https://rs-school-learn-words.herokuapp.com';

  static wordsURL = `${ServerApi.baseURL}/words`;

  static usersURL = `${ServerApi.baseURL}/users`;

  static signInURL = `${ServerApi.baseURL}/signin`;

  async getWords(group?: number, page?: number): Promise<WordType[]> {
    const response: Response = await fetch(
      `${ServerApi.wordsURL}?_group=${group}&page=${page}`
    );
    return response.json();
  }
}
