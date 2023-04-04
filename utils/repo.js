import CLUI from "clui";
import fs from "fs";
import git from "simple-git";
import touch from "touch";
import lodash from "lodash";
import { Octokit } from "@octokit/rest";
import configstore from "configstore";
import inquirer from "./inquirer.js";
import gh from "./github.js";
import file from "./file.js";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

const { Spinner } = CLUI;
const conf = new configstore(pkg.name);

export default {
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
  setupRepo: async () => {
    const spinner = new Spinner("初始化本地仓库并推送到远程中...");
    spinner.start();

    try {
      await git.init();
      await git.add(".gitignore");
      await git.add("./*");
      await git.commit("Initial commit");
      await git.addRemote("origin", url);
      await git.push("origin", "master");
    } finally {
      spinner.stop();
    }
  },
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
        console.log(status, data);
      })
      .catch((err) => console.log("errrrrrrr", err))
      .finally(() => spinner.stop());
  },
};
