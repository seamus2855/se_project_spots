class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards()]);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  async getInitialCards() {
    const res = await fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
    return this._checkResponse(res);
  }

  async request(path, options) {
    const res = await fetch(`${this._baseUrl}${path}`, options);
    return this._checkResponse(res);
  }

  async editUserInfo({ name, about }) {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
    return this._checkResponse(res);
  }

  async editAvatarInfo({ avatar }) {
    const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    });
    return this._checkResponse(res);
  }
}

// Instantiate Api and call the instance method instead of calling it on the class
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1", // replace with your real base URL
  headers: { "Content-Type": "application/json" },
});

api
  .getInitialCards()
  .then((result) => {
    // process the result
    console.log(result);
  })
  .catch((err) => {
    console.error();
  });

export default Api;
