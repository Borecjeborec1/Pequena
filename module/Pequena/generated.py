
# Automaticly generated code.
# Changes here can get overwritten!

import os


class Api:
    def __init__(self, window):
        self._window = window

    def isdir(self, _path):
        return os.path.isdir(_path)

    def isfile(self, _path):
        return os.path.isfile(_path)

    def mkdir(self, _path):
        os.mkdir(_path)

    def pathExists(self, _path):
        return os.path.exists(_path)

    def readFile(self, _path):
        with open(_path, 'r') as file:
            return file.read()

    def readdir(self, _path):
        return os.listdir(_path)

    def writeFile(self, _path, _content):
        with open(_path, 'w') as file:
            file.write(_content)

    def basename(self, _path):
        return os.path.basename(_path)

    def dirname(self, _path):
        return os.path.dirname(_path)

    def join(self, *paths):
        return os.path.join(*paths)

    def resolve(self, *paths):
        return os.path.abspath(os.path.join(*paths))

    def getWindowInfo(self):
        return {"x": self._window.x, "y": self._window.y, "width": self._window.width, "height": self._window.height}

    def hideWindow(self):
        return self._window.hide()

    def minimizeWindow(self):
        return self._window.minimize()

    def moveWindow(self, _x, _y):
        return self._window.move(_x, _y)

    def resizeWindow(self, _width, _height):
        return self._window.resize(_width, _height)

    def setWindowName(self, _name):
        return self._window.set_title(_name)

    def toggleFullscreen(self):
        return self._window.toggle_fullscreen()

    def unhideWindow(self):
        return self._window.show()

    def unminimizeWindow(self):
        return self._window.restore()


JS_INIT_STRING = """const __Node__ = {'Fs': {'isdir': 'pywebview.api.isdir', 'isfile': 'pywebview.api.isfile', 'mkdir': 'pywebview.api.mkdir', 'pathExists': 'pywebview.api.pathExists', 'readFile': 'pywebview.api.readFile', 'readdir': 'pywebview.api.readdir', 'writeFile': 'pywebview.api.writeFile'}, 'Path': {'basename': 'pywebview.api.basename', 'dirname': 'pywebview.api.dirname', 'join': 'pywebview.api.join', 'resolve': 'pywebview.api.resolve'}}
"""
