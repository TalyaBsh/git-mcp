import { getRepoData, getRepoDataFromUrl, HOST_TEMP_URL } from "./repoData";
import type { RepoData } from "./repoData";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const testCases: {
  title: string;
  input: { requestHost: string; requestUrls: string[] };
  expected: RepoData;
}[] = [
  {
    title: "git-mcp.talya7625.workers.dev",
    input: {
      requestHost: "git-mcp.talya7625.workers.dev",
      requestUrls: [
        "https://git-mcp.talya7625.workers.dev/mrdoob/three.js",
        "/mrdoob/three.js",
      ],
    },
    expected: {
      owner: "mrdoob",
      repo: "three.js",
      urlType: "github",
      host: "git-mcp.talya7625.workers.dev",
    },
  },
  {
    title: "repomcp.com",
    input: {
      requestHost: "repomcp.com",
      requestUrls: ["https://repomcp.com/mrdoob/three.js", "/mrdoob/three.js"],
    },
    expected: {
      owner: "mrdoob",
      repo: "three.js",
      urlType: "github",
      host: "repomcp.com",
    },
  },
  {
    title: "myOwner.repomcp.com",
    input: {
      requestHost: "ownerName.repomcp.com",
      requestUrls: ["https://ownerName.repomcp.com/repoName", "/repoName"],
    },
    expected: {
      owner: "ownerName",
      repo: "repoName",
      urlType: "subdomain",
      host: "ownerName.repomcp.com",
    },
  },
  {
    title: "generic (docs)",
    input: {
      requestHost: "repomcp.com",
      requestUrls: ["https://repomcp.com/docs", "/docs"],
    },
    expected: {
      owner: "docs",
      repo: null,
      urlType: "github",
      host: "repomcp.com",
    },
  },
  {
    title: "generic (docs) subdomain",
    input: {
      requestHost: "docs.repomcp.com",
      requestUrls: ["https://docs.repomcp.com/"],
    },
    expected: {
      owner: "docs",
      repo: null,
      urlType: "subdomain",
      host: "docs.repomcp.com",
    },
  },
  {
    title: HOST_TEMP_URL,
    input: {
      requestHost: HOST_TEMP_URL,
      requestUrls: [
        `https://${HOST_TEMP_URL}/myOwner/myRepo`,
        `/myOwner/myRepo`,
      ],
    },
    expected: {
      owner: "myOwner",
      repo: "myRepo",
      urlType: "github",
      host: HOST_TEMP_URL,
    },
  },
  {
    title: "unknown",
    input: {
      requestHost: "test.com",
      requestUrls: ["https://test.com/myOwner/myRepo", "/myOwner/myRepo"],
    },
    expected: {
      owner: null,
      repo: null,
      urlType: "unknown",
      host: "test.com",
    },
  },
  {
    title: "localhost",
    input: {
      requestHost: "localhost",
      requestUrls: [
        "http://localhost:3000/mrdoob/three.js",
        "/mrdoob/three.js",
      ],
    },
    expected: {
      owner: "mrdoob",
      repo: "three.js",
      urlType: "github",
      host: "localhost",
    },
  },
];

describe("RepoData", () => {
  testCases.forEach((testCase) => {
    describe(`should return the correct repo data for ${testCase.title}`, () => {
      testCase.input.requestUrls.forEach((requestUrl) => {
        it(`should return the correct repo data for ${testCase.input.requestHost} + ${requestUrl}`, () => {
          const result = getRepoData({
            requestHost: testCase.input.requestHost,
            requestUrl,
          });
          expect(result).toEqual(testCase.expected);
        });
      });
    });
  });
});

const flatTestCases = {
  "microsoft/playwright-mcp": [
    "https://github.com/microsoft/playwright-mcp",
    "https://github.com/microsoft/playwright-mcp/blob/main/src/mcp-server.ts",
    "https://microsoft.github.io/playwright-mcp",
    "https://microsoft.github.io/playwright-mcp/blob/main/src/mcp-server.ts",
    "https://repomcp.com/microsoft/playwright-mcp",
    "https://repomcp.com/microsoft/playwright-mcp/blob/main/src/mcp-server.ts",
    "https://microsoft.repomcp.com/playwright-mcp",
    "https://microsoft.repomcp.com/playwright-mcp/blob/main/src/mcp-server.ts",
    "github.com/microsoft/playwright-mcp",
    "github.com/microsoft/playwright-mcp/blob/main/src/mcp-server.ts",
    "microsoft.github.io/playwright-mcp",
    "microsoft.github.io/playwright-mcp/blob/main/src/mcp-server.ts",
    "repomcp.com/microsoft/playwright-mcp",
    "repomcp.com/microsoft/playwright-mcp/blob/main/src/mcp-server.ts",
    "microsoft.repomcp.com/playwright-mcp",
    "microsoft.repomcp.com/playwright-mcp/blob/main/src/mcp-server.ts",
    "microsoft/playwright-mcp",
    "http://localhost:3000/microsoft/playwright-mcp",
    "localhost:3000/microsoft/playwright-mcp/blob/main/src/mcp-server.ts",
    `${HOST_TEMP_URL}/microsoft/playwright-mcp`,
  ],
  "null/null": [
    "microsoft.gitrmcp.io/playwright-mcp/blob/main/src/mcp-server.ts",
    "localhost:a/microsoft/playwright-mcp/blob/main/src/mcp-server.ts",
  ],
  "docs/null": [
    "docs.repomcp.com",
    "docs.github.io",
    "repomcp.com/docs",
    "localhost:3000/docs",
  ],
};
describe("getRepoDataFromUrl", () => {
  Object.entries(flatTestCases).forEach(([testCase, urls]) => {
    it(`should return the correct repo data for ${testCase}`, () => {
      urls.forEach((url) => {
        const result = getRepoDataFromUrl(url);
        expect(`${result.owner}/${result.repo ?? null}`).toEqual(testCase);
      });
    });
  });
});
