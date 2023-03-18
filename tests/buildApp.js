const { execSync } = require('child_process');
execSync("pyinstaller ./test.py --add-data build/ ")