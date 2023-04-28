const { spawnInEnv, checkForEnv, checkForPequena, killProcess } = require("./lib.js")

checkForEnv()
checkForPequena()

async function checkForPyinstaller() {
  let res = await spawnInEnv(`pip install pyinstaller`, true)
  return res
}

checkForPyinstaller()
const buildProcess = spawnInEnv(`cd Pequena && pyinstaller --onefile --noconsole ../main.py --distpath ../dist/ --workpath tmp/ --add-data=Pequena/build;Pequena/build`)


buildProcess.stdout.on("data", (data) => {
  console.log("Data: " + data.toString());
});
buildProcess.stderr.on("data", (data) => {
  console.log("Err: " + data.toString());
});

process.on('exit', (code) => {
  killProcess(buildProcess.pid)
});

process.on('SIGINT', () => {
  killProcess(buildProcess.pid)
});