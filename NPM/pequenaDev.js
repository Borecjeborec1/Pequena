const { spawn } = require('child_process');
const chokidar = require('chokidar');

let pyProcess = null;

function startPyProcess() {
  pyProcess = spawn('__PYTHONPATH__', ['-u', 'index.py']);
  pyProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
}

startPyProcess();

const watcher = chokidar.watch('.');

watcher.on('change', () => {
  console.log('Changes detected, restarting Python process...');
  pyProcess.kill();
  startPyProcess();
});

process.on('exit', () => {
  pyProcess.kill();
});
