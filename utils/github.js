import { Octokit } from "@octokit/rest";
import CLUI from "clui";
import fs from "fs";
import configstore from "configstore";

import chalk from "chalk";
import inquirer from "./inquirer.js";

const { Spinner } = CLUI;
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const conf = new configstore(pkg.name);

const getLocalToken = async () => {
  const localToken = conf.get("github.token");
  console.log("localtoken", localToken);
  if (localToken) {
    validateGithubToken(localToken);
  } else {
    const { githubToken = null } = await inquirer.askGithubToken();
    if (githubToken) {
      validateGithubToken(githubToken);
    }
  }
};

const validateGithubToken = (token) => {
  const octokit = new Octokit({
    auth: token,
  });
  const spinner = new Spinner("Authing...");
  spinner.start();

  octokit
    .request("GET /user")
    .then(({ data, status }) => {
      if (status === 200) {
        conf.set("github.token", token);
        console.log(chalk.yellow("授权成功"));
      }
    })
    .catch((err) => {
      console.log("auth failed", err);
    })
    .finally(() => spinner.stop());
};

export default {
  getLocalToken,
  validateGithubToken,
};
