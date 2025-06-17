class ApiClient {
  #apiEndpoint;
  constructor(apiEndpoint) {
    this.#apiEndpoint = apiEndpoint;
  }
  /**
   * @param {strubg} method
   * @param {string} path
   * @param {any} body
   * @returns {Promise<any>}
   */
  req = async (method, path, body) => {
    const header = new Headers();
    const jwt = localStorage.getItem("session-token");
    if (jwt != null) header.append("authorization", `Bearer ${jwt}`);
    header.append("content-type", "application/json");
    const url = this.#apiEndpoint + path;

    const res = await fetch(url, {
      method: method,
      headers: header,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };
  get = (path) => this.req("GET", path);
  post = (path, body) => this.req("POST", path, body);
  put = (path, body) => this.req("PUT", path, body);
  delete = (path, body) => this.req("DELETE", path, body);
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_ENDPOINT);
