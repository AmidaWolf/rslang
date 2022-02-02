import { routes, RoutesI } from './routes';
import { ErrorPage } from '../../view/pages/ErrorPage/ErrorPage';
import { Header } from '../../shared/component/header/Header';
import { parseLocationURL } from '../../shared/utils/parseLocationURL';
import { Footer } from '../../shared/component/footer/Footer';

export class Router {
  async rout() {
    const content = <HTMLElement>document.getElementById('pageContainer');
    const header = <HTMLElement>document.querySelector('.header');
    const footer = <HTMLElement>document.querySelector('.footer');

    const request = parseLocationURL();

    const parsedURL =
      (request.resource ? `/${request.resource}` : '/') +
      (request.id ? '/:id' : '') +
      (request.verb ? `/${request.verb}` : '');

    const headerComponent = new Header();
    header.innerHTML = <string>(<unknown>await headerComponent.render());
    await headerComponent.afterRender();

    const footerComponent = new Footer();
    footer.innerHTML = <string>(<unknown>await footerComponent.render());
    await footerComponent.afterRender();

    const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] =>
      obj[key];
    const GetPage = getKeyValue<RoutesI, keyof RoutesI>(routes, parsedURL);
    const page = GetPage ? new GetPage() : new ErrorPage();
    content.innerHTML = <string>(<unknown>await page.render());
    await page.afterRender();
  }
}
