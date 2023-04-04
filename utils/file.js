import fs from "fs";
import path from "path";
import process from "process";

export default {
	getCurrentDirBase: () => {
		return path.basename(process.cwd())
	},
	dirExists: filePath => {
		return fs.existsSync(filePath)
	}
}
