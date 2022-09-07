import fs from "fs";
import path from "path";
import { exec } from "child_process";

const execYabber = (filePath) => {
  exec(`cd tools && cd Yabber && Yabber.exe ${filePath}`, (error, data) => {});
};

export const getAllInputFiles = async () => {
  return await fs.promises.readdir("./input");
};

export const execYabberInInputFiles = async () => {
  const files = await getAllInputFiles();

  for await (const file of files) {
    const scriptPath = path.resolve();

    const filePath = `${scriptPath}/input/${file}`;

    execYabber(filePath);
  }
};

export const execYabberInFmgFiles = async () => {
  const files = await getAllInputFiles();

  const folders = getOnlyPermitedFolder(files);

  for (const folder of folders) {
    const files = await fs.promises.readdir(
      `./input/${folder}/msg/engUS/64bit`
    );

    for (const file of files) {
      const scriptPath = path.resolve();

      const filePath = `${scriptPath}/input/${folder}/msg/engUS/64bit/${file}`;

      execYabber(filePath);
    }
  }
};

const getOnlyPermitedFolder = (files) => {
  const permitedFolders = ["menu_dlc1-msgbnd-dcx"];

  return files.filter((file) => permitedFolders.includes(file));
};
