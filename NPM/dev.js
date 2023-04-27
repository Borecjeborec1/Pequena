const { spawnInEnv, checkForEnv, checkForPequena, killProcess } = require("./lib.js")

checkForEnv()
checkForPequena()

let pyProcess = spawnInEnv("python main.py");

pyProcess.stdout.on("data", (data) => {
  console.log("Data: " + data.toString());
});

pyProcess.stderr.on("data", (data) => {
  console.log("Err: " + data.toString());
});

pyProcess.on('exit', (code, signal) => {
  if (code === 0 && signal === null) {
    console.log(`Python process closed by user. Qutting Dev reload`);
    process.exit();
  }
});

process.on('exit', (code) => {
  console.log(`Closing pequena window.`);
  killProcess(pyProcess.pid)
});

process.on('SIGINT', () => {
  killProcess(pyProcess.pid)
});

const chokidar = require('chokidar');
const watcher = chokidar.watch('./client');
watcher.on('change', async () => {
  console.log('Changes detected, restarting Pequena app...');
  let res = await killProcess(pyProcess.pid, true)
  pyProcess = spawnInEnv("python main.py")
});