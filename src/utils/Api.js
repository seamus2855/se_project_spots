class Api {
  constructor({ baseUrl, headers }) {
    // Standard implementation implies an options object
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleServerResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  }

  // Could be improved: students can make a special method for fetching and checking responses not to duplicate it in every request:
  //  _request(url, options) {
  //     return fetch(url, options).then(this._handleServerResponse)
  //  }

  getAppInfo() {
    return Promise.all([this.getCardList(), this.getUserInfo()]);
  }

  async getCardList() {
    const res = await fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
    return this._handleServerResponse(res);
  }

  async addCard({ name, link }) {
    const res = await fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
    return this._handleServerResponse(res);
  }

  async removeCard(cardID) {
    const res = await fetch(`${this._baseUrl}/cards/${cardID}`, {
      method: "DELETE",
      headers: this._headers,
    });
    return this._handleServerResponse(res);
  }

  async getUserInfo() {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
    return this._handleServerResponse(res);
  }

  async setUserInfo({ name, about }) {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
    return this._handleServerResponse(res);
  }

  async setUserAvatar({ avatar }) {
    const res = await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    });
    return this._handleServerResponse(res);
  }

  async changeLikeCardStatus(cardID, like) {
    // Standard implementation: 2 different methods for liking and disliking
    const res = await fetch(`${this._baseUrl}/cards/${cardID}/likes`, {
      method: like ? "PUT" : "DELETE",
      headers: this._headers,
    });
    return this._handleServerResponse(res);
  }
}

export default Api;
