import inquirer from "inquirer";
import files from "./file.js";
import minimist from "minimist";
import chalk from "chalk";

export default {
  askGithubToken: () => {
    console.log(
      chalk.red("Scope", ["user", "public_repo", "repo", "repo:status"]),
    );
    return inquirer.prompt([
      {
        name: "githubToken",
        type: "input",
        message: "请输入github token",
        validate: (value) => !!value.length || "请输入github token",
      },
    ]);
  },
  askRepoInfo: () => {
    const argv = minimist(process.argv.slice(2));
    return inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "git repo name:",
        default: argv._[0] || files.getCurrentDirBase(),
        validate: (value) => !!value.length || "请输入git仓库名称",
      },
      {
        name: "description",
        type: "input",
        message: "repo description:",
        default: argv._[1] || null,
        validate: (value) => !!value.length || "请输入git仓库描述",
      },
      {
        name: "type",
        type: "list",
        message: "publick or private:",
        choices: ["public", "private"],
        defaule: "public",
        validate: (value) => !!value.length || "请选择git仓库类型",
      },
    ]);
  },
  askIgnoreFiles: (filelist) =>
    inquirer.prompt([
      {
        type: "checkbox",
        name: "ignore",
        message: "选择你要忽略的文件",
        choices: filelist,
        default: ["node_modules", ".idea"],
      },
    ]),
};
