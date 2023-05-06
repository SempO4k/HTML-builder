const path = require('path');
const fs = require('fs');
const { stdout, stdin } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Input a text please(use \'exit\' command or \'CTRL+C\' to close app):\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') process.exit();
  output.write(data);
});

process.on('exit', () => { stdout.write('good luck!') });
process.on('SIGINT', () => { process.exit() });
