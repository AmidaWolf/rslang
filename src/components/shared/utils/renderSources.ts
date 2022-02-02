import { loadSources } from './loadSources';

export const renderSources = {
  async renderImage(image: string, description: string) {
    const myImage = <HTMLImageElement>await loadSources.loadImage(image);
    const img = document.createElement('img');
    img.src = myImage.src;
    img.alt = description;
    img.width = 100;
    img.height = 100;

    return img;
  },

  async renderImageHTML(image: string, description: string, className: string) {
    const myImage = <HTMLImageElement>await loadSources.loadImage(image);
    return `
            <img class=${className} src=${myImage.src} alt=${description} width="100" height="100">
        `;
  },

  async renderImageBG(image: string, container: HTMLElement) {
    const myContainer = container;
    const myImage = <HTMLImageElement>await loadSources.loadImage(image);
    myContainer.style.backgroundImage = `url(${myImage.src})`;
  },

  renderP(text: string, variable: string, classNameP: string) {
    const paragraphElement = document.createElement('p');
    paragraphElement.className = classNameP;
    paragraphElement.innerText = text + variable;
    return paragraphElement;
  },
};
