export function pathToRegExp(path) {
  return new RegExp("^" + path.replaceAll(/:(\w+)/g, (_, $1) => `(?<${$1}>[-_\\w]+)`) + "/?$", "i");
}
