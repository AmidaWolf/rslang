import { MainPage } from '../view/pages/MainPage/MainPage';
import { TextbookPage } from '../view/pages/TextbookPage/TextbookPage';
import { VocabularyPage } from '../view/pages/VocabularyPage/VocabularyPage';
import { StatisticsPage } from '../view/pages/StatisticsPage/StatisticsPage';
import { MinigamesPage } from '../view/pages/MinigamesPage/MinigamesPage';
import { AudiogamePage } from '../view/pages/AudiogamePage/AudiogamePage';
import { SprintgamePage } from '../view/pages/SprintgamePage/SprintgamePage';
import { DevelopersPage } from '../view/pages/DevelopersPage/DevelopersPage';
import { RoutesPath } from './RoutesPath';

export interface RoutesI {
  [key: string]:
    | typeof MainPage
    | typeof TextbookPage
    | typeof VocabularyPage
    | typeof StatisticsPage
    | typeof MinigamesPage
    | typeof AudiogamePage;
}

export const routesText = {
  [RoutesPath.START]: 'Main',
  [RoutesPath.AUTHORIZATION]: 'Authentication',
  [RoutesPath.TEXTBOOK]: 'Textbook',
  [RoutesPath.VOCABULARY]: 'Vocabulary',
  [RoutesPath.STATISTICS]: 'Statistics',
  [RoutesPath.MINIGAMES]: 'Minigames',
  [RoutesPath.AUDIOGAME]: 'Audiogame',
  [RoutesPath.SPRINTGAME]: 'Sprintgame',
  [RoutesPath.DEVELOPERS]: 'Developers',
};

export const routes = {
  [RoutesPath.START]: MainPage,
  [RoutesPath.TEXTBOOK]: TextbookPage,
  [RoutesPath.VOCABULARY]: TextbookPage,
  [RoutesPath.STATISTICS]: StatisticsPage,
  [RoutesPath.MINIGAMES]: MinigamesPage,
  [RoutesPath.AUDIOGAME]: AudiogamePage,
  [RoutesPath.SPRINTGAME]: SprintgamePage,
  [RoutesPath.DEVELOPERS]: DevelopersPage,
};
