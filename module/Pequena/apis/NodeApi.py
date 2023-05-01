# Those files are not actually used anywhere.
# They are segregated for better orientation and then compiled with `build.py` file.

import os


class NodeApi:
    class Fs:
        def readFile(self, _path):
            with open(_path, 'r') as file:
                return file.read()

        def writeFile(self, _path, _content):
            with open(_path, 'w') as file:
                file.write(_content)

        def mkdir(self, _path):
            os.mkdir(_path)

        def readdir(self, _path):
            return os.listdir(_path)

        def pathExists(self, _path):
            return os.path.exists(_path)

        def isfile(self, _path):
            return os.path.isfile(_path)

        def isdir(self, _path):
            return os.path.isdir(_path)

    class Path:
        def join(self, *paths):
            return os.path.join(*paths)

        def basename(self, _path):
            return os.path.basename(_path)

        def dirname(self, _path):
            return os.path.dirname(_path)

        def resolve(self, *paths):
            return os.path.abspath(os.path.join(*paths))
