export const loadSources = {
  async loadJsonData(resource: string) {
    const res = await fetch(resource);
    return res.json();
  },

  loadImage(src: string) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });
  },

  async loadHTML(url: string) {
    const response = await fetch(url);
    return response.text();
  },
};
