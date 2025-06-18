import { api } from "../api";
import { createSignal } from "../element-helper/element-helper";

export class AuthValidationError extends Error {
  #errors;
  constructor(message, errors) {
    super(message);
    this.#errors = errors;
  }
  get errors() {
    return this.#errors;
  }
}

class Auth {
  #accessToken;
  #refreshToken;
  #user;
  #setUser;
  #userMetadata;
  constructor() {
    this.#accessToken = new AccessToken(4.9 * 60 * 1000);
    this.#refreshToken = new RefreshToken();
    this.#userMetadata = new UserMetadata();
    const [user, setUser] = createSignal(this.#userMetadata.get());
    this.#user = user;
    this.#setUser = setUser;
  }
  get user() {
    return this.#user();
  }
  async login(username, password) {
    username = username.trim();
    password = password.trim();
    if (!username) {
      throw new AuthValidationError("아이디를 입력해 주세요.", [
        { name: "username", error: "아이디를 입력해 주세요." },
      ]);
    }
    if (!password) {
      throw new AuthValidationError("비밀번호를 입력해 주세요.", [
        { name: "password", error: "비밀번호를 입력해 주세요." },
      ]);
    }

    const body = await api
      .post("/accounts/login/")
      .body({
        username,
        password,
      })
      .send();
    this.#accessToken.set(body.access);
    this.#refreshToken.set(body.refresh);
    this.#userMetadata.set(body.user);
    this.#setUser(body.user);
  }
  logout() {
    this.#accessToken.clear();
    this.#refreshToken.clear();
    this.#userMetadata.clear();
    this.#setUser(null);
  }
  getAccessToken = async () => {
    const accessToken = this.#accessToken.get();
    if (accessToken != null) return accessToken;
    const refreshToken = this.#refreshToken.get();
    if (refreshToken == null) return null;
    try {
      const body = await api
        .post("/accounts/token/refresh/")
        .body({
          refresh: refreshToken,
        })
        .send();
      this.#accessToken.set(body.access);
      return body.access;
    } catch (error) {
      this.logout();
      if (error instanceof Response) {
        if (error.status === 401) {
          return null;
        }
      }
      console.error(error);
      return null;
    }
  };
}

class AccessToken {
  #lifetime;
  #token = null;
  #expiredAt = 0;
  constructor(lifetime) {
    this.#lifetime = lifetime;
  }
  get() {
    if (Date.now() > this.#expiredAt) {
      return null;
    }
    return this.#token;
  }
  set(token) {
    this.#token = token;
    this.#expiredAt = Date.now() + this.#lifetime;
  }
  clear() {
    this.#token = null;
    this.#expiredAt = 0;
  }
}

class RefreshToken {
  static #key = "refresh-token";
  get() {
    return localStorage.getItem(RefreshToken.#key);
  }
  set(token) {
    return localStorage.setItem(RefreshToken.#key, token);
  }
  clear() {
    return localStorage.removeItem(RefreshToken.#key);
  }
}
class UserMetadata {
  static #key = "user-metadata";
  get() {
    return JSON.parse(localStorage.getItem(UserMetadata.#key));
  }
  set(metadata) {
    return localStorage.setItem(UserMetadata.#key, JSON.stringify(metadata));
  }
  clear() {
    return localStorage.removeItem(UserMetadata.#key);
  }
}

export const auth = new Auth();
