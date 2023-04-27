const fs = require('fs');
const path = require('path');

const rootPath = "../../"
const pythonFile = "main.py"

function changePackageJSON() {
  const packagePath = path.join(rootPath, 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.log('package.json does not exist, creating it using npm init...');
    let json = {
      "scripts": {
        "start": `node Pequena/start.js`,
        "lib": `node Pequena/dev.js`,
        "build": `pyinstaller --onefile --noconsole index.py --workpath tmp/ --add-data=\"build;build\"`
      }
    }
    fs.writeFileSync(rootPath + "package.json", JSON.stringify(json))
    console.log('package.json created successfully!');
  }

  const packageJson = require(packagePath);

  packageJson.scripts.start = 'node Pequena/start.js';
  packageJson.scripts.dev = 'node Pequena/dev.js';

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('Start and dev scripts added to package.json!');
}

function createPequenaFolder() {
  const folderPath = path.join(rootPath, 'Pequena');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);

    const startJS = fs.readFileSync(__dirname + "/start.js", "utf-8")
    const startJSPath = path.join(folderPath, 'start.js');
    fs.writeFileSync(startJSPath, startJS);

    const devJS = fs.readFileSync(__dirname + "/dev.js", "utf-8")
    const devJSPath = path.join(folderPath, 'dev.js');
    fs.writeFileSync(devJSPath, devJS);

    const libJS = fs.readFileSync(__dirname + "/lib.js", "utf-8")
    const libJSPath = path.join(folderPath, 'lib.js');
    fs.writeFileSync(libJSPath, libJS);

    console.log('Pequena folder and scripts created successfully!');
  } else {
    console.log('Pequena folder already exists, skipping creation.');
  }
}
function createIndexPy() {
  if (!fs.existsSync(rootPath + pythonFile))
    fs.copyFileSync(pythonFile, rootPath + pythonFile)
}

changePackageJSON()
createPequenaFolder()
createIndexPy()
