#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

import files from "./utils/file.js";
import github from "./utils/github.js";
import repo from "./utils/repo.js";

clear();

// console.log(
//   chalk.yellow(figlet.textSync("Ginit", { horizontalLayout: "full" })),
// );

if (files.dirExists(".git")) {
  console.log(chalk.red("已经存在一个本地仓库"));
  process.exit();
}

const run = async () => {
  await github.getLocalToken();
  const ssh_url = repo.createRemoteRepo();
  await repo.createGitignore();
  await repo.setupRepo(ssh_url);
  console.log(chalk.green("All done!"));
};

run();
