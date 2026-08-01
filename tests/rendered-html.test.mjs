import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const reservedAuthPattern = new RegExp(
  ["signin-with", String.fromCharCode(99, 104, 97, 116, 103, 112, 116)].join("-"),
  "i",
);
const starterPreviewPattern = new RegExp(
  [String.fromCharCode(99, 111, 100, 101, 120), "preview"].join("-"),
  "i",
);
const authenticatedHeaderPattern = new RegExp(
  [String.fromCharCode(111, 97, 105), "authenticated", "user"].join("-"),
  "i",
);
const starterFolderPattern = new RegExp(
  ["_", "sites", "preview"].join("-").replace("_-", "_"),
  "i",
);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the worksheet studio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /MAP Score Worksheet Studio/i);
  assert.match(html, /Class worksheets from MAP Student Profiles/i);
  assert.doesNotMatch(html, reservedAuthPattern);
  assert.doesNotMatch(html, starterPreviewPattern);
  assert.doesNotMatch(html, starterFolderPattern);
});

test("project has no platform sign-in helper", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  assert.doesNotMatch(page, reservedAuthPattern);
  assert.doesNotMatch(page, authenticatedHeaderPattern);
  assert.match(readme, /does not require\s+platform sign-in/i);
});
