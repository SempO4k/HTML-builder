const path = require('path');
const { createReadStream, createWriteStream } = require('node:fs');
const { mkdir, readdir, readFile, writeFile, copyFile } = require('node:fs/promises');

const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');
const styleDir = path.join(__dirname, 'styles');
const componentsDir = path.join(__dirname, 'components');
const layoutPath = path.join(__dirname, 'template.html');

async function copyFiles(src, dist) {
  try {
    await mkdir(dist);
  } catch (err) {
    console.error(err.message);
  }
  const files = await readdir(src, { withFileTypes: true });
  try {
    for ( const file of files) {
      const srcPath = path.join(src, file.name);
      const distPath = path.join(dist, file.name);
      if (file.isFile()) {
        await copyFile(srcPath, distPath);
      } else {
        try {
          await copyFiles(srcPath, distPath); 
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function buildStyles(src, dist) {
  const output = createWriteStream(dist);
  const files = await readdir(src);
  for (const file of files) {
    const input = createReadStream(path.join(__dirname, 'styles', file));
    input.on('data', (chunk) => output.write(chunk));
  }
}

async function buildPage() {
  try {
    await mkdir(distDir, { require: true });
    const layoutHtml = await readFile(layoutPath, 'utf-8');
    const componentsFiles = await readdir(componentsDir);
    const components = {};
    for (const file of componentsFiles) {
      const fileName = file.slice(0, -5);
      const fileContent = await readFile(path.join(componentsDir, file), 'utf-8');
      components[fileName] = fileContent;
    }
    let page = layoutHtml;
    for (const [name, content] of Object.entries(components)) {
      page = page.replace(new RegExp(`{{${name}}}`, 'g'), content);
    }
    await writeFile(path.join(distDir, 'index.html'), page)
  } catch (err) {
    console.error(err.message);
  }
}

buildStyles(styleDir, path.join(__dirname, 'project-dist', 'style.css'));
buildPage();
copyFiles(assetsDir, path.join(distDir, 'assets'));
