import test from "ava";
import { parseLinkHeader } from "./index";

test("foo", t => {
  t.pass();
});

test("bar", async t => {
  const bar = Promise.resolve("bar");

  t.is(await bar, "bar");
});

test("two links", async t => {
  const input =
    '<https://api.github.com/repositories/8783588/issues?page=2>; rel="next", <https://api.github.com/repositories/8783588/issues?page=4>; rel="last"';
  const links = parseLinkHeader(input);
  t.is(links.next, "https://api.github.com/repositories/8783588/issues?page=2");
  t.is(links.last, "https://api.github.com/repositories/8783588/issues?page=4");
});

test("three links", async t => {
  const input =
    '<https://api.github.com/repositories/8783588/issues?page=4>; rel="prev", <https://api.github.com/repositories/8783588/issues?page=4>; rel="last", <https://api.github.com/repositories/8783588/issues?page=1>; rel="first"';
  const links = parseLinkHeader(input);
  t.is(
    links.prev,
    "https://api.github.com/repositories/8783588/issues?page=4",
    "prev"
  );
  t.is(
    links.last,
    "https://api.github.com/repositories/8783588/issues?page=4",
    "last"
  );
  t.is(
    links.first,
    "https://api.github.com/repositories/8783588/issues?page=1",
    "first"
  );
});
