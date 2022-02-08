export const loadSources = {
  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });
  },

  async loadHTML(path: string): Promise<string> {
    const response = await fetch(path);
    return response.text();
  },
};
