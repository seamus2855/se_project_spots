class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Private method to handle the server response for all fetch calls
  _handleServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
    // Reject the promise if the server response is not okay
    return Promise.reject(`Error: ${res.status}`);
  }

  // Private method to encapsulate the fetch logic, reducing repetition
  async _request(url, options) {
    try {
      const res = await fetch(url, options);
      return this._handleServerResponse(res);
    } catch (err) {
      // Handle network errors or other fetch failures
      return Promise.reject(`Fetch Error: ${err.message}`);
    }
  }

  getAppInfo() {
    return Promise.all([this.getCardList(), this.getUserInfo()]);
  }

  async getCardList() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  async addCard({ name, link }) {
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    });
  }

  async removeCard(cardID) {
    return this._request(`${this._baseUrl}/cards/${cardID}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  async getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  async setUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    });
  }

  async setUserAvatar({ avatar }) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    });
  }

  async changeLikeCardStatus(cardID, like) {
    return this._request(`${this._baseUrl}/cards/${cardID}/likes`, {
      method: like ? "PUT" : "DELETE",
      headers: this._headers,
    });
  }
}

export default Api;
