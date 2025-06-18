export class ApiBuilder {
  #url;
  #method;
  #headers = new Headers();
  #body;
  #plugins = [];
  constructor() {}
  url(url) {
    this.#url = url;
    return this;
  }
  method(method) {
    this.#method = method;
    return this;
  }
  header(name, value) {
    this.#headers.append(name, value);
    return this;
  }
  body(body) {
    if (this.#method === "GET") return this; // Not allowed for GET
    this.#headers.set("Content-Type", "application/json");
    this.#body = JSON.stringify(body);
    return this;
  }
  use(plugin) {
    this.#plugins.push(plugin);
    return this;
  }
  async send() {
    for (const plugin of this.#plugins) {
      await plugin(this);
    }
    if (this.#url == null) throw new Error("URL is not set");
    const res = await fetch(this.#url, {
      method: this.#method,
      headers: this.#headers,
      body: this.#body,
    });
    if (!res.ok) throw res;
    return await res.json();
  }
}
