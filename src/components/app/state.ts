export const store = {
  localServer: true,

  setLocalServer(option: boolean) {
    this.localServer = option;
  },

  getLocalServer() {
    return this.localServer;
  },
};
