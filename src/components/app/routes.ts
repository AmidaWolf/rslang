import { MainPage } from '../view/pages/MainPage/MainPage';
import { TextbookPage } from '../view/pages/TextbookPage/TextbookPage';
import { AuthorizationPage } from '../view/pages/AuthorizationPage/AuthorizationPage';
import { StatisticsPage } from '../view/pages/StatisticsPage/StatisticsPage';
import { MinigamesPage } from '../view/pages/MinigamesPage/MinigamesPage';
import { AudiogamePage } from '../view/pages/AudiogamePage/AudiogamePage';

export interface RoutesI {
  [key: string]:
    | typeof MainPage
    | typeof AuthorizationPage
    | typeof TextbookPage
    | typeof StatisticsPage
    | typeof MinigamesPage
    | typeof AudiogamePage;
}

export enum RoutesPath {
  START = '/',
  AUTHORIZATION = '/authorization',
  TEXTBOOK = '/textbook',
  STATISTICS = '/statistics',
  MINIGAMES = '/minigames',
  AUDIOGAME = '/audiogame',
}

export const routesText = {
  [RoutesPath.START]: 'Main',
  [RoutesPath.AUTHORIZATION]: 'Authorization',
  [RoutesPath.TEXTBOOK]: 'Textbook',
  [RoutesPath.STATISTICS]: 'Statistics',
  [RoutesPath.MINIGAMES]: 'Minigames',
  [RoutesPath.AUDIOGAME]: 'Audiogame',
};

export const routes = {
  [RoutesPath.START]: MainPage,
  [RoutesPath.AUTHORIZATION]: AuthorizationPage,
  [RoutesPath.TEXTBOOK]: TextbookPage,
  [RoutesPath.STATISTICS]: StatisticsPage,
  [RoutesPath.MINIGAMES]: MinigamesPage,
  [RoutesPath.AUDIOGAME]: AudiogamePage,
};
