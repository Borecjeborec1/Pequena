const fs = require('fs');
const changelogPath = 'CHANGELOG.md';

function updateChangelog(version, message, type) {
  const changelogContent = fs.readFileSync(changelogPath, 'utf8').split("#### [");
  const currentDate = new Date().toISOString().split('T')[0];
  for (let i in changelogContent) {
    if (changelogContent[i].includes(version)) {
      console.log(`Added ${message} to ${type} in ${changelogPath} version v${version}`)
      if (type == "/feature") {
        changelogContent[i] = changelogContent[i].replace(`##### Implemented enhancements:`, `##### Implemented enhancements:\n- ${message}`)
        return changelogContent.join("#### [")
      }
      else if (type == "/bugfix") {
        changelogContent[i] = changelogContent[i].replace(`##### Fixed bugs:`, `##### Fixed bugs:\n- ${message}`)
        return changelogContent.join("#### [")
      }
    }
  }
  let structure = ""
  if (type == "/feature") {
    structure = `# Changelog
#### [${version}] - ${currentDate}

[Full Changelog](https://github.com/Borecjeborec1/Pequena/commits/main)

##### Implemented enhancements:
- ${message}

##### Fixed bugs:
`
  } else if (type == "/bugfix") {
    structure = `# Changelog
#### [${version}] - ${currentDate}
[Full Changelog](https://github.com/Borecjeborec1/Pequena/commits/main)

##### Implemented enhancements:

##### Fixed bugs:
- ${message}
`
  }
  console.log(`Created new version v${version} in ${changelogPath} with ${message} inside ${type}`)
  return structure + changelogContent.join("#### [").replace("# Changelog", "")
}

function parseArguments(args) {
  let flag = ""
  let message = ""
  for (let i in args) {
    if (args[i] == "/bugfix" || args[i] == "/feature")
      flag = args[i]
    else
      message += args[i] + " "
  }
  return { flag, message }
}

const { flag, message } = parseArguments(process.argv.slice(2));

const { version } = require("../NPM/package.json");
const { execSync } = require('child_process');
if (flag == "/feature" || flag == "/bugfix" && message && version) {

  fs.writeFileSync(changelogPath, updateChangelog(version, message, flag))
  execSync(`gp ${message}`)
  console.log(`Pushed to github succesfuly`)
} else {
  console.log(`Parameters missing. Required: flag, message, version. Recieved ${flag}, ${message}, ${version}`)
}