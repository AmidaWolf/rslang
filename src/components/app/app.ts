import { routes, RoutesI } from './routes';
import { ErrorPage } from '../view/pages/ErrorPage/ErrorPage';
import { Header } from '../shared/common/header/Header';
import { parseLocationURL } from '../shared/utils/parseLocationURL';
import { Footer } from '../shared/common/footer/Footer';
import { RoutesPath } from './RoutesPath';

export class App {
  static async renderHeader() {
    const header = <HTMLElement>document.querySelector('.header');
    const headerComponent = new Header();
    header.innerHTML = <string>(<unknown>await headerComponent.renderHTML());
    await headerComponent.afterRender();
  }

  static async renderFooter() {
    const footer = <HTMLElement>document.querySelector('.footer');
    const footerComponent = new Footer();
    footer.innerHTML = <string>(<unknown>await footerComponent.renderHTML());
    await footerComponent.afterRender();
  }

  static clearFooter() {
    const footer = <HTMLElement>document.querySelector('.footer');
    footer.innerHTML = '';
  }

  static async renderContent() {
    await App.renderHeader();

    const container = <HTMLElement>document.getElementById('pageContainer');
    const request = parseLocationURL();

    const parsedURL =
      (request.resource ? `/${request.resource}` : '/') +
      (request.subresource ? `/${request.subresource}` : '') +
      (request.verb ? `/${request.verb}` : '');

    const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] =>
      obj[key];
    const GetPage = getKeyValue<RoutesI, keyof RoutesI>(routes, parsedURL);
    const page = GetPage ? new GetPage(container) : new ErrorPage(container);
    await page.run();

    if (
      parsedURL === RoutesPath.AUDIOGAME ||
      parsedURL === RoutesPath.SPRINTGAME
    ) {
      App.clearFooter();
    } else {
      await App.renderFooter();
    }
  }

  async run() {
    await App.renderContent();
  }
}
