export enum UrlI {
  baseUrl = 'https://rs-school-learn-words.herokuapp.com',
  users = '/users',
  signIn = '/signin',
}

export const Loader = {
  async errorHandler(res: Response) {
    if (res.status === 401 || res.status === 404) {
      console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
    }
    return Promise.resolve(res);
  },

  async getUser(id: string): Promise<void> {
    return fetch(`${UrlI.baseUrl + UrlI.users}/${id}`)
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error(err));
  },

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    return fetch(`${UrlI.baseUrl + UrlI.users}`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error(err));
  },
};
