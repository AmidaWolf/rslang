import {
  WordType,
  UserBodyType,
  UpdateUserBodyType,
  GetTokensType,
  UserWordType,
  StatisticsType,
  SettingsType,
  SignRequestBody,
  SignResponseBody,
  GetUserResponseType,
  ErrorType,
} from '../../types';

export default class ServerApi {
  static baseURL = 'https://rs-school-learn-words.herokuapp.com';

  static wordsURL = `${ServerApi.baseURL}/words`;

  static usersURL = `${ServerApi.baseURL}/users`;

  static signInURL = `${ServerApi.baseURL}/signin`;

  static async getWords(group: number, page: number): Promise<WordType[]> {
    const response: Response = await fetch(
      `${ServerApi.wordsURL}?group=${group}&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
      return [];
    }
    return response.json();
  }

  static async getWord(id: string): Promise<WordType> {
    const response: Response = await fetch(`${ServerApi.wordsURL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  static async createUser(body: UserBodyType): Promise<GetUserResponseType> {
    const response: Response = await fetch(ServerApi.usersURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  static async getUser(id: string | null): Promise<GetUserResponseType> {
    const response: Response = await fetch(`${ServerApi.usersURL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
    return response.json();
  }

  static async updateUser(
    id: string,
    body: UpdateUserBodyType
  ): Promise<GetUserResponseType> {
    const response: Response = await fetch(`${ServerApi.usersURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  static async deleteUser(id: string): Promise<void> {
    await fetch(`${ServerApi.usersURL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
  }

  // TODO - need to realize how getNewUserTokens should work correctly
  static async getNewUserTokens(id: string | null): Promise<GetTokensType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${id}/tokens`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );
    return response.json();
  }

  static async getUserWords(id: string): Promise<UserWordType[]> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${id}/words`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );
    return response.json();
  }

  static async getUserWord(
    userId: string,
    wordId: string
  ): Promise<UserWordType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/words/${wordId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );
    return response.json();
  }

  static async createUserWord(
    userId: string,
    wordId: string,
    body: UserWordType
  ): Promise<UserWordType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/words/${wordId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  }

  static async updateUserWord(
    userId: string,
    wordId: string,
    body: UserWordType
  ): Promise<UserWordType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/words/${wordId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  }

  static async deleteUserWord(userId: string, wordId: string): Promise<void> {
    await fetch(`${ServerApi.usersURL}/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
  }

  static async getUserAggregatedWords(
    id: string,
    group = 0,
    page = 0,
    wordsPerPage = 20,
    filter?: { [key: string]: string | number | boolean }
  ): Promise<WordType[]> {
    const URL = filter
      ? `${ServerApi.usersURL}/${id}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`
      : `${ServerApi.usersURL}/${id}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}`;

    const response: Response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
    return response.json();
  }

  static async getUserAggregatedWord(
    userId: string,
    wordId: string
  ): Promise<WordType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/aggregatedWords/${wordId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );
    return response.json();
  }

  static async getUserStatistics(id: string): Promise<StatisticsType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${id}/statistics`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );
    return response.json();
  }

  static async updateUserStatistics(
    id: string,
    body: StatisticsType
  ): Promise<StatisticsType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${id}/statistics`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  }

  static async getSettings(id: string): Promise<SettingsType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${id}/settings`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );
    return response.json();
  }

  static async updateSettings(
    id: string,
    body: SettingsType
  ): Promise<SettingsType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${id}/settings`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  }

  static async signIn(
    body: SignRequestBody
  ): Promise<SignResponseBody | ErrorType> {
    const response: Response = await fetch(`${ServerApi.signInURL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.log('signIn request error');
      return { message: 'Error' };
    }
    return response.json();
  }
}
