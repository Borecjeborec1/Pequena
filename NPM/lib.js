const { spawn, execSync, spawnSync, exec } = require("child_process");
const path = require("path");
const fs = require("fs");




function spawnInEnv(cmd, sync = false) {
  const venvActivateFile = process.platform === 'win32' ? 'activate.bat' : 'activate';
  const activateCmd = process.platform === 'win32' ? `"${__dirname}/Scripts/${venvActivateFile}"` : `source "${__dirname}/Scripts/${venvActivateFile}"`;
  if (sync)
    return spawnSync(`${activateCmd} && ${cmd}`, [], { shell: true });
  return spawn(`${activateCmd} && ${cmd}`, [], { shell: true });
}

async function checkForEnv() {
  if (!fs.existsSync(path.join(__dirname, "Lib", "site-packages")) || !fs.existsSync(path.join(__dirname, "Scripts")) || !fs.existsSync(path.join(__dirname, "pyvenv.cfg"))) {
    let pyPath = "py"
    try {
      execSync('python --version');
      pyPath = "python"
      console.log("Found python, looking for pip")
    } catch (e) {
      console.log('Python is not installed. Looking for Python 3!');
      try {
        execSync('python3 --version');
        pyPath = "python3"
      } catch (e) {
        console.log('Python3 is not installed. Looking for Py!');
        try {
          execSync('py --version');
          pyPath = "py"
        } catch (e) {
          console.error('Neither python nor python3 or py is installed. Please install it before using Pequena');
          process.exit(1);
        }
      }
    }

    // check if pip is installed
    try {
      execSync(`${pyPath} -m pip --version`);
      console.log("Found pip, initializing venv")
    } catch (e) {
      console.log(`Could not find pip in ${pyPath}. Looking for global pip.`);
      try {
        execSync('pip --version');
      } catch (e) {
        console.error('Pip is not installed. Please install Pip before using this package.');
        process.exit(1);
      }
    }

    // Initialize a new virtual environment
    console.log("Initializing new env")
    let res = await execSync(`${pyPath} -m venv Pequena`);
    return res
  }
  return true
}
async function checkForPequena() {
  if (!fs.existsSync(path.join(__dirname, "Lib", "site-packages", "Pequena"))) {
    console.log("Installing Pequena")
    let res = await spawnInEnv(`pip install Pequena`, true)
    const fileToFix = path.join(__dirname, "Lib", "site-packages", "webview", "http.py")
    let fileContent = fs.readFileSync(fileToFix, "utf-8")
    fileContent = fileContent.replace(/import tempfile/, "import os")
    fileContent = fileContent.replace(/tempfile.TemporaryFile\(\)/g, "open(os.devnull, 'w')")
    fs.writeFileSync(fileToFix, fileContent)
    return res
  }
  return true
}


function killProcess(_pid, sync = false) {
  if (sync)
    spawnSync("taskkill", ["/pid", _pid, '/f', '/t']);
  spawn("taskkill", ["/pid", _pid, '/f', '/t']);
}


module.exports = { spawnInEnv, checkForEnv, checkForPequena, killProcess }
