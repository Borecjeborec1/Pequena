const fs = require("fs")

let pjson = require("../NPM/package.json")
let numbers = pjson.version.split(".").map(Number)
numbers[2] += 1
pjson.version = numbers.join(".")
console.log(pjson)

fs.writeFileSync("./NPM/package.json", JSON.stringify(pjson))
