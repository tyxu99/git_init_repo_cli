import CLUI from "clui";
import fs from "fs";
import { simpleGit } from "simple-git";
import touch from "touch";
import lodash from "lodash";
import { Octokit } from "@octokit/rest";
import configstore from "configstore";
import inquirer from "./inquirer.js";
import chalk from "chalk";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

const { Spinner } = CLUI;
const conf = new configstore(pkg.name);
const git = simpleGit();

export default {
  createRemoteRepo: async () => {
    const { name, description, type } = await inquirer.askRepoInfo();
    const spinner = new Spinner("正在创建远程仓库...");
    spinner.start();
    const octokit = new Octokit({
      auth: conf.get("github.token"),
    });
    octokit.repos
      .createForAuthenticatedUser({
        name,
        description,
        private: type === "private",
      })
      .then(({ status, data }) => {
        console.log("status data", status);
        return data.ssh_url;
      })
      .catch((err) => {
        if (err) {
          switch (err.status) {
            case 401:
              console.log(chalk.red("认证失败，请提供正确的token"));
              break;
            case 422:
              console.log(chalk.red("远端已存在同名仓库"));
              break;
            default:
              console.log(chalk.red(err));
          }
        }
      })
      .finally(() => spinner.stop());
  },
  createGitignore: async () => {
    const filelist = lodash.without(fs.readdirSync("."), ".git", ".gitignore");

    if (filelist.length) {
      const file = await inquirer.askIgnoreFiles(filelist);
      if (file.ignore.length) {
        fs.writeFileSync(".gitignore", file.ignore.join("\n"));
      } else {
        touch(".gitignore");
      }
    } else {
      touch(".gitignore");
    }
  },
  setupRepo: async (url) => {
    const spinner = new Spinner("初始化本地仓库并推送到远程中...");
    spinner.start();

    try {
      console.log("git try");
      await git.init();
      await git.add(".gitignore");
      await git.add("./*");
      await git.commit("Initial commit");
      await git.addRemote("origin", url);
      await git.push("origin", "master");
    } catch (err) {
      console.log("catch err", err);
    } finally {
      console.log("git finally");
      spinner.stop();
    }
  },
};
