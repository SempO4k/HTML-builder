const path = require("path");
const { readdir, stat } = require("node:fs/promises");

async function printFileInfo() {
  try {
    const files = await readdir(path.join(__dirname, "secret-folder"), {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const stats = await stat(path.join(__dirname, "secret-folder"));
        const fileExt = path.extname(file.name);
        const fileName = path.basename(file.name, fileExt);
        const fileSize = stats.size / 1024;
        console.log(
          `${fileName} - ${fileExt.substring(1)} - ${fileSize.toFixed(3)}kb`
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}
printFileInfo();
