const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function changePackageJSON() {
  const packagePath = path.join(process.cwd(), 'package.json');
  // Check if package.json exists
  if (fs.existsSync(packagePath)) {
    console.log('package.json already exists, skipping creation.');
  } else {
    // Create package.json using npm init
    console.log('package.json does not exist, creating it using npm init...');
    execSync('npm init -y');
    console.log('package.json created successfully!');
  }

  // Read the package.json file
  const packageJson = require(packagePath);

  // Add the start and dev scripts
  packageJson.scripts.start = 'node Pequena/start.js';
  packageJson.scripts.dev = 'node Pequena/dev.js';

  // Write the modified package.json file back to disk
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('Start and dev scripts added to package.json!');
}

function createPequenaFolder() {
  const folderPath = path.join(process.cwd(), 'Pequena');
  if (!fs.existsSync(folderPath)) {
    // Create the folder
    fs.mkdirSync(folderPath);

    // Create the start.js file inside the folder
    const startJS = `
      console.log('Starting Pequena...');
      // Your code goes here
    `;
    const startJSPath = path.join(folderPath, 'start.js');
    fs.writeFileSync(startJSPath, startJS);

    // Create the dev.js file inside the folder
    const devJS = `
      console.log('Starting Pequena in dev mode...');
      // Your code goes here
    `;
    const devJSPath = path.join(folderPath, 'dev.js');
    fs.writeFileSync(devJSPath, devJS);

    console.log('Pequena folder and scripts created successfully!');
  } else {
    console.log('Pequena folder already exists, skipping creation.');
  }
}




changePackageJSON()
createPequenaFolder()