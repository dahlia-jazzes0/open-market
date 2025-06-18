import { ApiBuilder } from "./api-builder";
import { wenivApi } from "./plugins";

export const api = {
  get: (path) => setup("GET", path),
  post: (path) => setup("POST", path),
};

function setup(method, path) {
  return new ApiBuilder().method(method).use(wenivApi(path));
}
