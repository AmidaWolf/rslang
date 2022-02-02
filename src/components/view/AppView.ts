export class AppView {
  private readonly html: () => void;

  private readonly func: () => void | null;

  constructor(html: () => void, func: () => void) {
    this.html = html;
    this.func = func;
  }

  async render() {
    return this.html();
  }

  async afterRender() {
    this.func();
  }
}
