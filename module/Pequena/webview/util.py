# -*- coding: utf-8 -*-

"""
(C) 2014-2019 Roman Sirokov and contributors
Licensed under BSD license

http://github.com/r0x0r/pywebview/
"""

import inspect
import json
import logging
import os
import re
import sys
import traceback
from http.cookies import SimpleCookie
from platform import architecture
from threading import Thread
from uuid import uuid4

import webview
from webview import http
from .js import api, npo, dom, event, drag

_token = uuid4().hex

default_html = """
    <!doctype html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
        </head>
        <body></body>
    </html>
"""

logger = logging.getLogger('pywebview')


class WebViewException(Exception):
    pass


def is_app(url):
    """ Returns true if 'url' is a WSGI or ASGI app. """
    return callable(url)

def is_local_url(url):
    return not ((is_app(url)) or ((not url) or (url.startswith('http://')) or (url.startswith('https://'))))

def needs_server(urls):
    return not not [url for url in urls if (is_app(url) or is_local_url(url))]


def get_app_root():
    """
    Gets the file root of the application.
    """

    if hasattr(sys, '_MEIPASS'): # Pyinstaller
        return sys._MEIPASS

    if getattr(sys, 'frozen', False): # cx_freeze
        return os.path.dirname(sys.executable)

    if 'pytest' in sys.modules:
        for arg in reversed(sys.argv):
            path = os.path.realpath(arg.split('::')[0])
            if os.path.exists(path):
                return path if os.path.isdir(path) else os.path.dirname(path)

    return os.path.dirname(os.path.realpath(sys.argv[0]))


def abspath(path):
    """
    Make path absolute, using the application root
    """
    path = os.fspath(path)
    if not os.path.isabs(path):
        path = os.path.join(get_app_root(), path)
    return os.path.normpath(path)


def base_uri(relative_path=''):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    base_path = get_app_root()
    if not os.path.exists(base_path):
        raise ValueError('Path %s does not exist' % base_path)

    return 'file://%s' % os.path.join(base_path, relative_path)


def create_cookie(input):
    if type(input) == dict:
        cookie = SimpleCookie()
        name = input['name']
        cookie[name] = input['value']
        cookie[name]['path'] = input['path']
        cookie[name]['domain'] = input['domain']
        cookie[name]['expires'] = input['expires']
        cookie[name]['secure'] = input['secure']
        cookie[name]['httponly'] = input['httponly']

        if sys.version_info.major >= 3 and sys.version_info.minor >= 8:
            cookie[name]['samesite'] = input.get('samesite')

        return cookie
    elif type(input) == str:
        return SimpleCookie(input)

    raise WebViewException('Unknown input to create_cookie')




def parse_file_type(file_type):
    '''
    :param file_type: file type string 'description (*.file_extension1;*.file_extension2)' as required by file filter in create_file_dialog
    :return: (description, file extensions) tuple
    '''
    valid_file_filter = r'^([\w ]+)\((\*(?:\.(?:\w+|\*))*(?:;\*\.\w+)*)\)$'
    match = re.search(valid_file_filter, file_type)

    if match:
        return match.group(1).rstrip(), match.group(2)
    else:
        raise ValueError('{0} is not a valid file filter'.format(file_type))


def parse_api_js(window, platform, uid=''):
    print("from parse")
    def generate_func(cls, prefix=""):
            func_list = []
            if inspect.isclass(cls):
                cls_dict = cls.__dict__
                if not prefix:
                    prefix = cls.__name__
            else:
                cls_dict = cls.__class__.__dict__
                if not prefix:
                    prefix = cls.__class__.__name__
            for name, func in cls_dict.items():
                if inspect.isclass(func):
                    full_name = prefix + "." + name
                    func_list.extend(generate_func(func, prefix=full_name))
                    
                elif callable(func) and not name.startswith('__'):
                    full_name = prefix + "." + name
                    try:
                        params = list(inspect.getfullargspec(func).args)  # Python 3
                    except AttributeError:
                        params = list(inspect.getargspec(func).args)  # Python 2
                    func_list.append({
                        'func': full_name,
                        'params': params
                    })
            return func_list

    try:
        func_list = generate_func(window._js_api)
    except Exception as e:
        logger.exception(e)
        func_list = [] 
        
    js_code = npo.src + event.src + \
        api.src % {
            'token': _token,
            'platform': platform,
            'uid': uid,
            'func_list': func_list,
            'js_api_endpoint': window.js_api_endpoint
        } + \
        dom.src + drag.src % {
            'drag_selector': webview.DRAG_REGION_SELECTOR,
            'zoomable': str(window.zoomable).lower(),
            'draggable': str(window.draggable).lower()
        }
    return js_code


def js_bridge_call(window, func_name, param, value_id):
    def _call():
        try:
            result = func(*func_params.values())
            result = json.dumps(result).replace('\\', '\\\\').replace('\'', '\\\'')
            code = 'window.pywebview._returnValues["{0}"]["{1}"] = {{value: \'{2}\'}}'.format(func_name, value_id, result)
        except Exception as e:
            print(traceback.format_exc())
            error = {
                'message': str(e),
                'name': type(e).__name__,
                'stack': traceback.format_exc()
            }
            result = json.dumps(error).replace('\\', '\\\\').replace('\'', '\\\'')
            code = 'window.pywebview._returnValues["{0}"]["{1}"] = {{isError: true, value: \'{2}\'}}'.format(func_name, value_id, result)

        window.evaluate_js(code)

    if func_name == 'moveWindow':
        window.move(*param)
        return

    if func_name == 'asyncCallback':
        value = json.loads(param) if param is not None else None

        if callable(window._callbacks[value_id]):
            window._callbacks[value_id](value)
        else:
            logger.error('Async function executed and callback is not callable. Returned value {0}'.format(value))

        del window._callbacks[value_id]
        return
    
    def get_method_from_string(func_name, parent_class):
        try:
            class_obj = parent_class
            method_name = func_name.split('.')[-1]
            nested_names = func_name.split('.',1)[1].split('.')
            for attr in nested_names[:-1]:
                class_obj = getattr(class_obj, attr)
            return getattr(class_obj, method_name)
        except:
            return None

    func = window._functions.get(func_name) or get_method_from_string(func_name,window._js_api)
    
    if func is not None:
        try:
            func_params = param
            t = Thread(target=_call)
            t.start()
        except Exception:
            logger.exception('Error occurred while evaluating function {0}'.format(func_name))
    else:
        logger.error('Function {}() does not exist'.format(func_name))


def escape_string(string):
    return string\
        .replace('\\', '\\\\') \
        .replace('"', r'\"') \
        .replace('\n', r'\n')\
        .replace('\r', r'\r')


def escape_line_breaks(string):
    return string.replace('\\n', '\\\\n').replace('\\r', '\\\\r')


def inject_base_uri(content, base_uri):
    pattern = r'<%s(?:[\s]+[^>]*|)>'
    base_tag = '<base href="%s">' % base_uri

    match = re.search(pattern % 'base', content)

    if match:
        return content

    match = re.search(pattern % 'head', content)
    if match:
        tag = match.group()
        return content.replace(tag, tag + base_tag)

    match = re.search(pattern % 'html', content)
    if match:
        tag = match.group()
        return content.replace(tag, tag + base_tag)

    match = re.search(pattern % 'body', content)
    if match:
        tag = match.group()
        return content.replace(tag, base_tag + tag)

    return base_tag + content


def interop_dll_path(dll_name):
    if dll_name == 'WebBrowserInterop.dll':
        dll_name = 'WebBrowserInterop.x64.dll' if architecture()[0] == '64bit' else 'WebBrowserInterop.x86.dll'

    # Unfrozen path
    dll_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'lib', dll_name)
    if os.path.exists(dll_path):
        return dll_path

    # Frozen path, dll in the same dir as the executable
    dll_path = os.path.join(os.path.dirname(os.path.realpath(sys.argv[0])), dll_name)
    if os.path.exists(dll_path):
        return dll_path

    try:
        # Frozen path packed as onefile
        if hasattr(sys, '_MEIPASS'): # Pyinstaller
            dll_path = os.path.join(sys._MEIPASS, dll_name)

        elif getattr(sys, 'frozen', False): # cx_freeze
            dll_path = os.path.join(sys.executable, dll_name)

        if os.path.exists(dll_path):
            return dll_path
    except Exception:
        pass

    raise Exception('Cannot find %s' % dll_name)

