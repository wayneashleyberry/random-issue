const got = require("got");
const async = require("async");
const _ = require("lodash");

const token = process.env.GITHUB_TOKEN;
const org = process.env.GITHUB_ORG;

const parseLinkHeader = input => {
  const parts = input.split(",");
  let next = "";
  let last = "";
  let first = "";
  let prev = "";
  parts.forEach(part => {
    const url = part.substring(
      part.lastIndexOf("<") + 1,
      part.lastIndexOf(">")
    );
    if (part.includes('rel="prev"')) {
      prev = url;
    }
    if (part.includes('rel="next"')) {
      next = url;
    }
    if (part.includes('rel="last"')) {
      last = url;
    }
    if (part.includes('rel="first"')) {
      first = url;
    }
  });
  return {
    prev,
    next,
    last,
    first
  };
};

const getIssues = async (token, owner, repo) => {
  let page = 1;
  let results = [];
  let end = false;

  while (end === false) {
    try {
      const response = await got(
        [
          "https://api.github.com/repos",
          owner,
          repo,
          "issues?page=" + page
        ].join("/"),
        {
          json: true,
          headers: {
            Authorization: "token " + token
          }
        }
      );

      const filtered = _.filter(response.body, x => {
        return x.locked === false && !x.pull_request;
      });

      results = results.concat(filtered);

      if (response.headers.link) {
        const links = parseLinkHeader(response.headers.link);
        end = !links.next;
      } else {
        end = true;
      }
    } catch (error) {
      return Promise.reject(error);
    }

    page++;
  }

  return Promise.resolve(results);
};

const getRepos = async (token, owner) => {
  let page = 1;
  let results = [];
  let end = false;

  while (end === false) {
    try {
      const response = await got(
        ["https://api.github.com/orgs", owner, "repos" + "?page=" + page].join(
          "/"
        ),
        {
          json: true,
          headers: {
            Authorization: "token " + token
          }
        }
      );

      const filtered = _.filter(response.body, x => {
        return x.open_issues > 0 && x.archived === false;
      });

      results = results.concat(filtered);

      const links = parseLinkHeader(response.headers.link);
      end = !links.next;
    } catch (error) {
      return Promise.reject(error);
    }

    page++;
  }

  return Promise.resolve(results);
};

const randomIssue = async (token, org) => {
  let repos;
  let issues = [];

  try {
    repos = await getRepos(token, org);
  } catch (err) {
    console.error(err);
    return;
  }

  return new Promise((resolve, reject) => {
    async.eachLimit(
      repos,
      3,
      (repo, done) => {
        if (!repo.name) {
          done();
          return;
        }

        getIssues(token, org, repo.name)
          .then(res => {
            issues = issues.concat(res);
            done();
          })
          .catch(err => {
            done(err);
          });
      },
      err => {
        if (err) {
          reject(err);
          return;
        }

        resolve(_.shuffle(issues)[0]);
      }
    );
  });
};

module.exports = { randomIssue, parseLinkHeader };
