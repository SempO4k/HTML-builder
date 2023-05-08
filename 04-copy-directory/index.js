const path = require('path');
const { mkdir, readdir, rm, copyFile } = require('node:fs/promises');

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'copy-files');

async function copyDirectory() {
  try {
    await rm(destDir, { recursive: true, force: true });
  } catch (err) {
    console.error(err.message)
  }
  try {
    await mkdir(destDir, { require: true });
  } catch (err) {
    console.error(err.message);
  }
  try {
    const files = await readdir(srcDir);
    for (const file of files) {
      copyFile(path.join(srcDir, file), path.join(destDir, file));
    }
  } catch (err) {
    console.error(err.message);
  }
}

copyDirectory();
