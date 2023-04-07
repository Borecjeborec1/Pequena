const { spawn } = require('child_process');
const chokidar = require('chokidar');

let pyProcess = null;

function startPyProcess() {
  pyProcess = spawn('python', ['-u', 'index.py']);
  pyProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  pyProcess.on('exit', (code, signal) => {
    if (code === 0 && signal === null) {
      console.log(`Python process closed by user. Qutting Dev reload`);
      process.exit();
    }
  });
}

startPyProcess();

const watcher = chokidar.watch('./client');

watcher.on('change', () => {
  console.log('Changes detected, restarting Python process...');
  pyProcess.kill();
  startPyProcess();
});

process.on('exit', () => {
  pyProcess.kill();
});
