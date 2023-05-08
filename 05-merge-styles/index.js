const path = require('path');
const { createReadStream, createWriteStream } = require('node:fs');
const { readdir } = require('node:fs/promises')


const styleDir = path.join(__dirname, 'styles');

async function mergeStyles() {
  try {
    const files = (await readdir(styleDir)).filter((file) => path.extname(file) === '.css');
    const output = createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    for (const file of files) {
      const input = createReadStream(path.join(__dirname, 'styles', file));
      input.on('data', (chunk) => output.write(chunk));
    }
  } catch (err) {
    console.error(err.message);
  }
}

mergeStyles();