import {
  WordType,
  UserBodyType,
  UpdateUserBodyType,
  UserWordResponseType,
  StatisticsType,
  SettingsType,
  SignRequestBody,
  SignResponseBody,
  GetUserResponseType,
  ErrorType,
  UserWordRequestType,
} from '../../types';
import {
  logOutUser,
  userDataLocalStorageWorker,
} from '../helpers/UserDataLocalStorageWorker';

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
          Accept: 'application/json',
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

  static async getWord(wordId: string): Promise<WordType> {
    const response: Response = await fetch(`${ServerApi.wordsURL}/${wordId}`, {
      method: 'GET',
      headers: {
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

    let userData;
    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        userData = await ServerApi.getUser(userId);
      }
    } else {
      userData = response.json();
    }

    return userData;
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

    let userData;
    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        userData = await ServerApi.updateUser(userId, body);
      }
    } else {
      userData = response.json();
    }

    return userData;
  }

  static async deleteUser(userId: string | null): Promise<void> {
    const response = await fetch(`${ServerApi.usersURL}/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        Accept: 'application/json',
      },
    });

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        await ServerApi.deleteUser(userId);
      }
    }
  }

  static async getNewUserTokens(userId: string | null): Promise<boolean> {
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

    if (response.ok) {
      console.log('new tokens: ', response.json());
      userDataLocalStorageWorker(await response.json());
      return true;
    }

    console.log('response not ok ', response);
    await logOutUser();
    return false;
  }

  static async getUserWords(userId: string): Promise<UserWordResponseType[]> {
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

    let wordsData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        wordsData = await ServerApi.getUserWords(userId);
      }
    } else {
      wordsData = response.json();
    }

    return wordsData;
  }

  static async getUserWord(
    userId: string,
    wordId: string
  ): Promise<UserWordRequestType | null> {
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

    let wordData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        wordData = await ServerApi.getUserWord(userId, wordId);
      }
    } else if (!response.ok) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
      return null;
    }

    wordData = await response.json();

    return wordData;
  }

  static async createUserWord(
    userId: string,
    wordId: string,
    body: UserWordRequestType
  ): Promise<UserWordResponseType | null> {
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

    let wordData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        wordData = await ServerApi.createUserWord(userId, wordId, body);
      }
    } else if (!response.ok) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
      return null;
    } else {
      wordData = await response.json();
    }

    return wordData;
  }

  static async updateUserWord(
    userId: string,
    wordId: string,
    body: UserWordRequestType
  ): Promise<UserWordResponseType | null> {
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

    let wordData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        wordData = await ServerApi.updateUserWord(userId, wordId, body);
      }
    } else if (!response.ok) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
      return null;
    }

    wordData = await response.json();

    return wordData;
  }

  static async deleteUserWord(userId: string, wordId: string): Promise<void> {
    const response = await fetch(
      `${ServerApi.usersURL}/${userId}/words/${wordId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        await ServerApi.deleteUserWord(userId, wordId);
      }
    }

    if (response.status === 404) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
    }
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

    let wordsData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        wordsData = await ServerApi.getUserAggregatedWords(userId);
      }
    } else if (!response.ok) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
      return [];
    }

    wordsData = await response.json();
    const result = wordsData[0].paginatedResults;

    // eslint-disable-next-line array-callback-return
    result.map((el) => {
      const res = el;
      // eslint-disable-next-line no-underscore-dangle
      res.id = res._id;
      // eslint-disable-next-line no-underscore-dangle
      delete res._id;
    });

    return result;
  }

  static async getUserHardWords(
    userId: string,
    page: number
  ): Promise<{ array: WordType[]; countAll: number } | null> {
    const response: Response = await fetch(
      `${ServerApi.usersURL}/${userId}/aggregatedWords?page=${page}&wordsPerPage=20&filter={"userWord.difficulty":"hard"}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          Accept: 'application/json',
        },
      }
    );

    let wordsData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        wordsData = await ServerApi.getUserAggregatedWords(userId);
      }
    } else if (!response.ok) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
      return null;
    }

    wordsData = await response.json();
    const result = wordsData[0].paginatedResults;

    // eslint-disable-next-line array-callback-return
    result.map((el) => {
      const res = el;
      // eslint-disable-next-line no-underscore-dangle
      res.id = res._id;
      // eslint-disable-next-line no-underscore-dangle
      delete res._id;
    });

    const res = {
      array: result,
      countAll:
        wordsData[0].totalCount.length === 1
          ? wordsData[0].totalCount[0].count
          : 0,
    };
    return res;
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

    let wordData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        wordData = await ServerApi.getUserAggregatedWord(userId, wordId);
      }
    } else {
      wordData = response.json();
    }

    if (response.status === 404) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
    }

    return wordData;
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

    let statisticsData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        statisticsData = await ServerApi.getUserStatistics(userId);
      }
    } else {
      statisticsData = response.json();
    }

    if (response.status === 404) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
    }

    return statisticsData;
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

    let statisticsData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        statisticsData = await ServerApi.updateUserStatistics(userId, body);
      }
    } else {
      statisticsData = response.json();
    }

    if (response.status === 404) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
    }

    return statisticsData;
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

    let settingsData;

    if (!response.ok) {
      if (response.status === 401) {
        if (await ServerApi.getNewUserTokens(userId)) {
          settingsData = await ServerApi.getSettings(userId);
        }
      }
      if (response.status === 404) {
        const baseSettings = {
          wordsPerDay: 0,
          optional: {
            difficult: `difficult;`,
            learnt: `learnt;`,
          },
        };
        settingsData = await ServerApi.updateSettings(userId, baseSettings);
      }
    } else {
      settingsData = response.json();
    }

    return settingsData;
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

    let settingsData;

    if (response.status === 401) {
      if (await ServerApi.getNewUserTokens(userId)) {
        settingsData = await ServerApi.updateSettings(userId, body);
      }
    } else {
      settingsData = response.json();
    }

    if (response.status === 404) {
      console.log(
        `Sorry, but there is ${response.status} error: ${response.statusText}`
      );
    }

    return settingsData;
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
