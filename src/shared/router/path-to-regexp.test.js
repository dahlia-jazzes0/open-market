import { expect, test } from "bun:test";
import { pathToRegExp } from "./path-to-regexp";

test("/", () => {
  const path = "/";
  const pattern = pathToRegExp(path);

  expect(pattern.test("/")).toBe(true);
  expect(pattern.test("/foo")).toBe(false);
  expect(pattern.test("/foo/")).toBe(false);
  expect(pattern.test("/foo/bar")).toBe(false);
  expect(pattern.test("/products")).toBe(false);
  expect(pattern.test("/products/")).toBe(false);
  expect(pattern.test("/products/53")).toBe(false);
});

test("/foo", () => {
  const path = "/foo";
  const pattern = pathToRegExp(path);

  expect(pattern.test("/")).toBe(false);
  expect(pattern.test("/foo")).toBe(true);
  expect(pattern.test("/foo/")).toBe(true);
  expect(pattern.test("/foo/bar")).toBe(false);
  expect(pattern.test("/products")).toBe(false);
  expect(pattern.test("/products/")).toBe(false);
  expect(pattern.test("/products/53")).toBe(false);
});

test("/foo/bar", () => {
  const path = "/foo/bar";
  const pattern = pathToRegExp(path);

  expect(pattern.test("/")).toBe(false);
  expect(pattern.test("/foo")).toBe(false);
  expect(pattern.test("/foo/")).toBe(false);
  expect(pattern.test("/foo/bar")).toBe(true);
  expect(pattern.test("/products")).toBe(false);
  expect(pattern.test("/products/")).toBe(false);
  expect(pattern.test("/products/53")).toBe(false);
});
test("/products", () => {
  const path = "/products";
  const pattern = pathToRegExp(path);

  expect(pattern.test("/")).toBe(false);
  expect(pattern.test("/foo")).toBe(false);
  expect(pattern.test("/foo/")).toBe(false);
  expect(pattern.test("/foo/bar")).toBe(false);
  expect(pattern.test("/products")).toBe(true);
  expect(pattern.test("/products/")).toBe(true);
  expect(pattern.test("/products/53")).toBe(false);
});
test("/products/:id", () => {
  const path = "/products/:id";
  const pattern = pathToRegExp(path);

  expect(pattern.test("/")).toBe(false);
  expect(pattern.test("/foo")).toBe(false);
  expect(pattern.test("/foo/")).toBe(false);
  expect(pattern.test("/foo/bar")).toBe(false);
  expect(pattern.test("/products")).toBe(false);
  expect(pattern.test("/products/")).toBe(false);
  expect(pattern.test("/products/53")).toBe(true);
});

test("/products/:productId/seller/:sellerId", () => {
  const path = "/products/:productId/seller/:sellerId";
  const pattern = pathToRegExp(path);

  expect(pattern.test("/")).toBe(false);
  expect(pattern.test("/foo")).toBe(false);
  expect(pattern.test("/foo/")).toBe(false);
  expect(pattern.test("/foo/bar")).toBe(false);
  expect(pattern.test("/products")).toBe(false);
  expect(pattern.test("/products/")).toBe(false);
  expect(pattern.test("/products/53")).toBe(false);
  expect(pattern.test("/products/53/seller")).toBe(false);
  expect(pattern.test("/products/53/seller/1")).toBe(true);

  expect("/products/53/seller/1".match(pattern).groups).toStrictEqual({
    productId: "53",
    sellerId: "1",
  });
});
