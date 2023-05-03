const fs = require("fs")
const { execSync } = require("child_process")

let pySetup = fs.readFileSync("./module/setup.py", "utf-8").split("\r\n")
for (let line in pySetup) {
  if (pySetup[line].includes("VERSION =")) {
    let numbers = pySetup[line].replace(/VERSION = |\"|\'/g, "").split(".").map(Number)
    numbers[2] += 1
    pySetup[line] = `VERSION = "${numbers.join(".")}"`
  }
}
fs.writeFileSync("./module/setup.py", pySetup.join("\r\n"))
if (fs.existsSync("./module/dist/"))
  fs.rmdirSync("./module/dist/", { recursive: true })
