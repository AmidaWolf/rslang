// GetTokensType and SignResponseBody are the same
export type OptionalType = {
  [key: string]: string;
};

export type UserWordOptionalType = {
  sprint: string;
  audio: string;
  allGames: string;
  learnt: boolean;
};

export type UserWordResponseType = {
  id: string;
  difficulty: string; // (hard/easy)
  wordId: string;
  optional: UserWordOptionalType;
};

export type UserWordRequestType = {
  difficulty: string; // (hard/easy)
  optional: UserWordOptionalType;
};

export type WordType = {
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
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
  userWord?: UserWordRequestType;
};

export type UserBodyType = {
  email: string;
  password: string;
  name?: string;
};

export type UpdateUserBodyType = {
  email: string;
  password: string;
  name?: string;
};

export type GetTokensType = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
};

export type StatisticsType = {
  learnedWords: number;
  optional: OptionalType;
};

export type SettingsType = {
  wordsPerDay: number;
  optional: OptionalType;
};

export type SignRequestBody = {
  email: string;
  password: string;
};

export type SignResponseBody = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
};

export type GetUserResponseType = {
  id: string;
  email: string;
  name?: string;
};

export type ErrorType = {
  [key: string]: string;
};

export type ModalContentType = {
  title: string;
  html: string;
};

export type Stat = {
  allWords: number;
  hardWords: number;
  easyWords: number;
  lerntWords: number;
  winRateAll: number;
  sprint: {
    all: number;
    win: number;
    lose: number;
    winRate: number;
  };
  audio: {
    all: number;
    win: number;
    lose: number;
    winRate: number;
  };
};
