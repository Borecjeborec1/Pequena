const { execSync } = require('child_process');
const fs = require('fs');
const baseDir = "../../"
const pythonFile = "index.py"


function installPequena() {
  // check if python3 is installed
  try {
    execSync('python --version');
    pythonNameInstalled = "python"
    console.log("Found python, looking for pip")
  } catch (e) {
    console.log('Python is not installed. Looking for Python 3!');
    try {
      execSync('python3 --version');
      pythonNameInstalled = "python3"
    } catch (e) {
      console.log('Python3 is not installed. Looking for Py!');
      try {
        execSync('py --version');
        pythonNameInstalled = "py"
      } catch (e) {
        console.error('Neither python/python3 nor py is installed. Please install it before using Pequena');
        process.exit(1);
      }
    }
  }

  // check if pip is installed
  try {
    execSync(`${pythonNameInstalled} -m pip --version`);
    console.log("Found pip, installing pequena")
  } catch (e) {
    console.log(`Could not find pip in ${pythonNameInstalled}. Looking for pip.`);
    try {
      execSync('pip --version');
    } catch (e) {
      console.error('Pip is not installed. Please install Pip before using this package.');
      process.exit(1);
    }
  }

  // install pequena
  try {
    execSync(`${pythonNameInstalled} -m pip install pequena`);
    console.log("Pequena installed!")
  } catch (e) {
    console.error('Failed to install Python packages.');
    process.exit(1);
  }

}

function createIndexPy() {
  fs.copyFileSync(pythonFile, baseDir + pythonFile)
}

installPequena()
createIndexPy()