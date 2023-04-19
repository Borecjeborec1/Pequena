const { spawn } = require('child_process');

const pyProcess = spawn('__PYTHONPATH__', ['-u', 'index.py']);

pyProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
pyProcess.stderr.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

process.on('exit', () => {
  pyProcess.kill();
});