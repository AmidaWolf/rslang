import { WordType } from '../../types';

export default class ServerApi {
  static baseURL = 'https://rs-school-learn-words.herokuapp.com';

  static wordsURL = `${ServerApi.baseURL}/words`;

  static usersURL = `${ServerApi.baseURL}/users`;

  static signInURL = `${ServerApi.baseURL}/signin`;

  static async getWords(group: number, page: number): Promise<WordType[]> {
    const response: Response = await fetch(
      `${ServerApi.wordsURL}?group=${group}&page=${page}`
    );
    if (!response.ok) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
      return [];
    }
    return response.json();
  }
}
