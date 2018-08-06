> Get a random GitHub issue for an organisation

[![Build Status](https://travis-ci.org/wayneashleyberry/random-issue.svg?branch=master)](https://travis-ci.org/wayneashleyberry/random-issue)
[![dependencies Status](https://david-dm.org/wayneashleyberry/random-issue/status.svg)](https://david-dm.org/wayneashleyberry/random-issue)
[![npm version](https://badge.fury.io/js/random-issue.svg)](https://npm.im/random-issue)

### Installation

```sh
npm i random-issue
```

### Usage

```js
const { randomIssue } = require("random-issue");
const token = process.env.GITHUB_TOKEN;
const org = process.env.GITHUB_ORG;

(async () => {
  const issue = await randomIssue(token, org);
  console.log(JSON.stringify(issue));
})();
```
