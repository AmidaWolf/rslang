import { MainPage } from '../view/pages/MainPage/MainPage';
import { TextbookPage } from '../view/pages/TextbookPage/TextbookPage';
import { StatisticsPage } from '../view/pages/StatisticsPage/StatisticsPage';
import { MinigamesPage } from '../view/pages/MinigamesPage/MinigamesPage';
import { AudiogamePage } from '../view/pages/AudiogamePage/AudiogamePage';
import { SprintgamePage } from '../view/pages/SprintgamePage/SprintgamePage';
import { DevelopersPage } from '../view/pages/DevelopersPage/DevelopersPage';

export interface RoutesI {
  [key: string]:
    | typeof MainPage
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
  SPRINTGAME = '/sprintgame',
  DEVELOPERS = '/developers',
}

export const routesText = {
  [RoutesPath.START]: 'Main',
  [RoutesPath.AUTHORIZATION]: 'Authorization',
  [RoutesPath.TEXTBOOK]: 'Textbook',
  [RoutesPath.STATISTICS]: 'Statistics',
  [RoutesPath.MINIGAMES]: 'Minigames',
  [RoutesPath.AUDIOGAME]: 'Audiogame',
  [RoutesPath.SPRINTGAME]: 'Sprintgame',
  [RoutesPath.DEVELOPERS]: 'Developers',
};

export const routes = {
  [RoutesPath.START]: MainPage,
  [RoutesPath.TEXTBOOK]: TextbookPage,
  [RoutesPath.STATISTICS]: StatisticsPage,
  [RoutesPath.MINIGAMES]: MinigamesPage,
  [RoutesPath.AUDIOGAME]: AudiogamePage,
  [RoutesPath.SPRINTGAME]: SprintgamePage,
  [RoutesPath.DEVELOPERS]: DevelopersPage,
};
