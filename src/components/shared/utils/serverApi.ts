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
  UserWordInitialType,
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

  static async getWord(userId: string): Promise<WordType> {
    const response: Response = await fetch(`${ServerApi.wordsURL}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.json();
  }

  static async createUser(
    body: UserBodyType
  ): Promise<GetUserResponseType | number> {
    const response: Response = await fetch(ServerApi.usersURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === 417) {
      return response.status;
    }
    return response.json();
  }

  static async getUser(userId: string | null): Promise<GetUserResponseType> {
    const response: Response = await fetch(`${ServerApi.usersURL}/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        Accept: 'application/json',
      },
    });
    return response.json();
  }

  static async updateUser(
    userId: string | null,
    body: UpdateUserBodyType
  ): Promise<GetUserResponseType> {
    const response: Response = await fetch(`${ServerApi.usersURL}/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  static async deleteUser(userId: string | null): Promise<void> {
    await fetch(`${ServerApi.usersURL}/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        Accept: 'application/json',
      },
    });
  }

  static async getNewUserTokens(userId: string | null): Promise<GetTokensType> {
    // TODO - need to realize how getNewUserTokens should work correctly
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/tokens`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
        },
      }
    );
    return response.json();
  }

  static async getUserWords(userId: string): Promise<UserWordType[]> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/words`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
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
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );
    if (response.status === 404) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
    }
    return response.json();
  }

  static async createUserWord(
    userId: string,
    wordId: string,
    body: UserWordInitialType
  ): Promise<UserWordType | []> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/words/${wordId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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

  static async updateUserWord(
    userId: string,
    wordId: string,
    body: UserWordInitialType
  ): Promise<UserWordType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/words/${wordId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
    userId: string,
    group = 0,
    page = 0,
    wordsPerPage = 20,
    filter?: { [key: string]: string | number | boolean }
  ): Promise<WordType[]> {
    const URL = filter
      ? `${ServerApi.usersURL}/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`
      : `${ServerApi.usersURL}/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}`;

    const response: Response = await fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        Accept: 'application/json',
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
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
        },
      }
    );
    return response.json();
  }

  static async getUserStatistics(userId: string): Promise<StatisticsType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/statistics`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
        },
      }
    );
    return response.json();
  }

  static async updateUserStatistics(
    userId: string,
    body: StatisticsType
  ): Promise<StatisticsType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/statistics`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  }

  static async getSettings(userId: string): Promise<SettingsType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/settings`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
        },
      }
    );
    return response.json();
  }

  static async updateSettings(
    userId: string,
    body: SettingsType
  ): Promise<SettingsType> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/settings`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    return response.json();
  }

  static async signIn(
    body: SignRequestBody
  ): Promise<SignResponseBody | ErrorType | number> {
    const response: Response = await fetch(`${ServerApi.signInURL}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      if (response.status === 403) {
        return response.status;
      }
      if (response.status === 404) {
        return response.status;
      }
      console.log('signIn request error');
      return { message: 'Error' };
    }
    return response.json();
  }
}
