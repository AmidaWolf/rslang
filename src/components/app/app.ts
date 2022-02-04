import { routes, RoutesI } from './routes';
import { ErrorPage } from '../view/pages/ErrorPage/ErrorPage';
import { Header } from '../shared/common/header/Header';
import { parseLocationURL } from '../shared/utils/parseLocationURL';
import { Footer } from '../shared/common/footer/Footer';

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

  static async renderContent() {
    const container = <HTMLElement>document.getElementById('pageContainer');
    const request = parseLocationURL();
    const parsedURL =
      (request.resource ? `/${request.resource}` : '/') +
      (request.id ? '/:id' : '') +
      (request.verb ? `/${request.verb}` : '');

    const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] =>
      obj[key];
    const GetPage = getKeyValue<RoutesI, keyof RoutesI>(routes, parsedURL);
    const page = GetPage ? new GetPage(container) : new ErrorPage(container);
    await page.run();
  }

  async run() {
    App.renderHeader()
      .then(() => App.renderFooter())
      .then(() => App.renderContent());
  }
}
