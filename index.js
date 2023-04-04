import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";

import files from "./utils/file.js";
import inquirer from "./utils/inquirer.js";
import github from "./utils/github.js";
import repo from "./utils/repo.js";

clear();

console.log(
  chalk.yellow(figlet.textSync("Ginit", { horizontalLayout: "full" })),
);

if (files.dirExists(".git")) {
  console.log(chalk.red("已经存在一个本地仓库"));
  process.exit();
}

// github.getLocalToken()

repo.createRemoteRepo();
