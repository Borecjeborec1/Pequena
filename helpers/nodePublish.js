const fs = require('fs');
const { spawnSync } = require('child_process');

const { version } = require("../package.json");
const npmJSON = require("../NPM/package.json");

if (npmJSON.version != version) {
  npmJSON.version = version
  fs.writeFileSync("./NPM/package.json", JSON.stringify(npmJSON))
  spawnSync(`cd NPM && npm publish`, [], { shell: true })
  console.log("Pushed to NPM v" + version)
}

