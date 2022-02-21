export const setElementHeight = () => {
  const main = <HTMLElement>document.querySelector('.main');
  const header = <HTMLElement>document.querySelector('.header');
  const footer = <HTMLElement>document.querySelector('.footer');

  const headerHeight = header.getBoundingClientRect().height;
  const footerHeight = footer.getBoundingClientRect().height;
  main.style.minHeight = `calc(100vh - ${headerHeight + footerHeight}px)`;
};
