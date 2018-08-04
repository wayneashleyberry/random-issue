> Get a random GitHub issue for an organisation

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
