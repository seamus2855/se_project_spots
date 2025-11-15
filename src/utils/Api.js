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
    return await fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._handleServerResponse);
  }

  async addCard({ name, link }) {
    return await fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._handleServerResponse);
  }

  async removeCard(cardID) {
    return await fetch(`${this._baseUrl}/cards/${cardID}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._handleServerResponse);
  }

  async getUserInfo() {
    return await fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._handleServerResponse);
  }

  async setUserInfo({ name, about }) {
    return await fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._handleServerResponse);
  }

  async setUserAvatar({ avatar }) {
    return await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._handleServerResponse);
  }

  async changeLikeCardStatus(cardID, like) {
    // Standard implementation: 2 different methods for liking and disliking
    return await fetch(`${this._baseUrl}/cards/${cardID}/likes`, {
      method: like ? "PUT" : "DELETE",
      headers: this._headers,
    }).then(this._handleServerResponse);
  }
}

export default Api;
