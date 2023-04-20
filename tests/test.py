import threading
import keyboard


def hotkey_listener():
    def on_triggered():
        print("Keyboard shortcut 'ctrl+shift+e' was pressed.")
    keyboard.add_hotkey('ctrl+shift+e', on_triggered)
    keyboard.wait()


listener_thread = threading.Thread(target=hotkey_listener)
listener_thread.start()

# Do other things here while the hotkey listener runs in the background...
print("here")
