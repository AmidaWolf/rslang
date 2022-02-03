import { WordsType } from '../../types';

export default class ServerApi {
  static baseURL = 'https://rs-school-learn-words.herokuapp.com';

  static wordsURL = `${ServerApi.baseURL}/words`;

  static usersURL = `${ServerApi.baseURL}/users`;

  static signInURL = `${ServerApi.baseURL}/signin`;

  async getWords(group: number, page: number): Promise<WordsType> {
    // const url: string =
    //   group && page ? `${ServerApi.words}?group=${group}&page=${page}`
    //     : group ? `${ServerApi.words}?group=${group}`
    //       : page ? `${ServerApi.words}?group=${page}`
    //         : ServerApi.words;

    const response: Response = await fetch(
      `${ServerApi.wordsURL}?group=${group}&page=${page}`
    );
    return response.json();
  }
}
