# Those files are not actually used anywhere.
# They are segregated for better orientation and then compiled with `build.py` file.

class PequenaApi:
    def __init__(self, window):
        self._window = window

    def getWindowInfo(self):
        return {"x": self._window.x, "y": self._window.y, "width": self._window.width, "height": self._window.height}

    def minimizeWindow(self):
        return self._window.minimize()

    def unminimizeWindow(self):
        return self._window.restore()

    def hideWindow(self):
        return self._window.hide()

    def unhideWindow(self):
        return self._window.show()

    def toggleFullscreen(self):
        return self._window.toggle_fullscreen()

    def moveWindow(self, _x, _y):
        return self._window.move(_x, _y)

    def resizeWindow(self, _width, _height):
        return self._window.resize(_width, _height)

    def setWindowName(self, _name):
        return self._window.set_title(_name)
