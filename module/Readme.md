# Pequena
Pequena is a desktop creation framework that allows you to create desktop applications using web technologies such as HTML, CSS, and JavaScript. It is built on top of the [webview](https://pypi.org/project/pywebview/) library for Python.

## NodeJS wrapper
If you can use Node.js, then you should use the [pequena](https://www.npmjs.com/package/pequena) wrapper library, which provides a Node.js API for Pequena.

I personaly advice you to use this if you have node installed. It has built-in scripts for compiling/hot reload/bundling/minimising/etc...

## Installation
Pequena can be installed using pip
```bash
pip install pequena
```

## Usage
To use `Pequena`, first import it:
```python
import Pequena
```

Then call the `init_window` function to set up the client source directory and the window name:
```python
Pequena.init_window("path/to/client/index.html", "Hello World!",width=800, height=600)
```

You can then create a window using the `start_window` function:
```python
Pequena.start_window()
``` 

By default, Pequena uses the `EdgeChromium` backend for webview, but you can also use other backends such as `PyQt5`, `QtWebEngine`, and `Gtk`. But those will require additional installs

You can expose Python functions to your client-side JavaScript code by using the `expose_function` function:
```python
def my_function():
    return "Hello, World!"
Pequena.expose_function(my_function)
``` 

In your client-side JavaScript code, you can then call the Python function using the `PEQUENA` object:
```Javascript
const result = await PEQUENA.my_function();
```

## License
Pequena is licensed under the MIT License.