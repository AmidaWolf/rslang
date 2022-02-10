import { MainPage } from '../view/pages/MainPage/MainPage';
import { TextbookPage } from '../view/pages/TextbookPage/TextbookPage';
import { AuthorizationPage } from '../view/pages/AuthorizationPage/AuthorizationPage';
import { StatisticsPage } from '../view/pages/StatisticsPage/StatisticsPage';
import { MinigamesPage } from '../view/pages/MinigamesPage/MinigamesPage';
import { DevelopersPage } from '../view/pages/DevelopersPage/DevelopersPage';

export interface RoutesI {
  [key: string]:
    | typeof MainPage
    | typeof AuthorizationPage
    | typeof TextbookPage
    | typeof StatisticsPage
    | typeof MinigamesPage;
}

export enum RoutesPath {
  START = '/',
  AUTHORIZATION = '/authorization',
  TEXTBOOK = '/textbook',
  STATISTICS = '/statistics',
  MINIGAMES = '/minigames',
  DEVELOPERS = '/developers',
}

export const routesText = {
  [RoutesPath.START]: 'Main',
  [RoutesPath.AUTHORIZATION]: 'Authorization',
  [RoutesPath.TEXTBOOK]: 'Textbook',
  [RoutesPath.STATISTICS]: 'Statistics',
  [RoutesPath.MINIGAMES]: 'Minigames',
  [RoutesPath.DEVELOPERS]: 'Developers',
};

export const routes = {
  [RoutesPath.START]: MainPage,
  [RoutesPath.TEXTBOOK]: TextbookPage,
  [RoutesPath.STATISTICS]: StatisticsPage,
  [RoutesPath.MINIGAMES]: MinigamesPage,
  [RoutesPath.DEVELOPERS]: DevelopersPage,
};
