// GetTokensType and SignResponseBody are the same
export type OptionalType = {
  [key: string]: string;
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

export type UserWordType = {
  id: string;
  difficulty: string;
  optional: OptionalType;
  wordId: string;
};

export type UserWordInitialType = {
  difficulty: string;
  optional: OptionalType;
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
