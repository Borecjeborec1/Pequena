const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let pyPath = "py"

function initInstalledPython() {
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
    console.log("Found pip, installing pequena")
  } catch (e) {
    console.log(`Could not find pip in ${pyPath}. Looking for pip.`);
    try {
      execSync('pip --version');
    } catch (e) {
      console.error('Pip is not installed. Please install Pip before using this package.');
      process.exit(1);
    }
  }

}


// Check if a venv exists in the current directory
// if (!fs.existsSync(path.join(__dirname, "venv"))) {
//   // Initialize a new virtual environment
//   spawn("pyPath", ["-m", "venv", "venv"], { stdio: "inherit" });
// }

// // Activate the virtual environment
initInstalledPython()
spawn(pyPath, ["-m", "venv", "."], { stdio: "inherit" });
// const venv_activate = path.join(__dirname, "bin", "activate");
// spawn(`source ${venv_activate}`, [], { stdio: "inherit", shell: true });

// // Install pywebview in the virtual environment
// spawn("pip", ["install", "pywebview"], { stdio: "inherit" });

// // // Run index.py using the virtual environment's Python and print output to console
// const process = spawn(pyPath, ["index.py"]);

// process.stdout.on("data", (data) => {
//   console.log(data.toString());
// });

// process.stderr.on("data", (data) => {
//   console.error(data.toString());
// });

// process.on("close", (code) => {
//   console.log(`child process exited with code ${code}`);
// });
