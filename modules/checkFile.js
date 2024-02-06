import fs from 'node:fs/promises';

export const checkFileExist = async (path) => {
  try {
    await fs.access(path);
  } catch (error) {
    console.error(`File ${path} not found.`);
    return false;
  }
  return true;
};


export const createFileIfNotExist = async (path) =>{
    try {
      await fs.access(path);
    } catch (error) {
      await fs.writeFile(path, JSON.stringify([]));
      console.error(`File ${path} is created!`);
      return true;
    }
}