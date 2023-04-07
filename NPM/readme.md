# Pequena
Pequena is a desktop creation framework that allows you to create desktop applications using web technologies such as HTML, CSS, and JavaScript. It is built on top of the [webview](https://pypi.org/project/pywebview/) library for Python.
It is supposed to be lightweight and easy to use, while keeping all the complex stuff.

## Installation
Pequena can be installed using npm
```bash
npm install pequena
```

## Usage
After the installation, index.py should appear in your root folder.
It's content should look like this:
```python
import Pequena

html_file = "path/to/client/index.html"
window_name = "Hello World!"

Pequena.init(html_file, window_name)
Pequena.create_window(width=800, height=600)
``` 
Replace the `path/to/client/index.html` to an actual client directory and you are ready to go!
PS: Index.html has to be in another folder than index.py. So I highly recommend using `client/` directory where all your frontend lives.
PSS: `pequenaStart.js` and `pequenaDev.js` should also appear in the root folder. Those files are used when run commands `npm run start` and `npm run dev`.

#### Running the app
Now you can run your app using
```bash
npm run start
```

Now use hot-reload functionality
```bash
npm run dev
```

#### Exposing functions
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
There are some prebuilt ones: *getWindowInfo*, *minimizeWindow*, *unminimizeWindow*, *hideWindow*, *unhideWindow*, *toggleFullscreen*, *moveWindow**, *resizeWin*d*ow, *setWindowName*, *readFile*, *writeFile*, *mkdir*, *readdir*, *pathExists*, *isfile*, *isdir*. More of them is comming soon with a better documentation.

#### Compiling
To compile the app pequena uses pyinstaller. The script in `package.json` comes with default settings which should work optimaly.
So you can run this command:
```bash
npm run build
```
A single binary file will be created in `dist/` folder.

## License
Pequena is licensed under the MIT License.