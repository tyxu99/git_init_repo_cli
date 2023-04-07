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
  if (localToken) {
    return validateGithubToken(localToken, "local");
  } else {
    const { githubToken = null } = await inquirer.askGithubToken();
    if (githubToken) {
      return validateGithubToken(githubToken, "input");
    }
  }
};

const validateGithubToken = (token, location) => {
  const octokit = new Octokit({
    auth: token,
  });
  const spinner = new Spinner("Authing...");
  location === "input" && spinner.start();

  return octokit
    .request("GET /user")
    .then(({ status }) => {
      if (status === 200) {
        if (location === "input") {
          conf.set("github.token", token);
          console.log(chalk.yellow("授权成功"));
        }
        return token;
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
