import os
import inspect
import re
import json

INDENT = "    "

dir_path = os.path.dirname(os.path.realpath(__file__))

files = [f for f in os.listdir(
    dir_path) if os.path.isfile(os.path.join(dir_path, f))]

api_files = [f for f in files if "Api" in f]

all_methods = ""
all_imports = []

class_methods = {}

for api_file in api_files:
    with open(os.path.join(dir_path, api_file), "r") as f:
        file_contents = f.read()
    imports = re.findall(r"import\s.+\n", file_contents)
    all_imports.extend(imports)

    module = __import__(api_file[:-3])
    for obj_name, obj in inspect.getmembers(module):
        if inspect.isclass(obj):
            if obj_name not in class_methods:
                class_methods[obj_name] = {}
            methods = []
            for method_name, method in inspect.getmembers(obj):
                if not method_name.startswith("__"):
                    if inspect.isclass(method):
                        nested_methods = {}
                        for nested_method_name, nested_method in inspect.getmembers(method):
                            if not nested_method_name.startswith("__") and not inspect.isclass(nested_method):
                                nested_methods[nested_method_name] = "pywebview.api." + \
                                    nested_method_name
                                all_methods += INDENT + inspect.getsource(
                                    nested_method).lstrip()
                        class_methods[obj_name][method_name] = nested_methods
                    else:
                        if not class_methods[obj_name]:
                            class_methods[obj_name] = {}
                        class_methods[obj_name][method_name] = "pywebview.api." + method_name
                        all_methods += INDENT + \
                            inspect.getsource(method).lstrip()


JS_INIT_STR = ""

for key in class_methods:
    if "pequena" in key.lower():
        continue
    s = key.replace("Api", "")
    JS_INIT_STR += f"const __{s}__ = {class_methods[key]};"

stringing_regex = r"'(pywebview\.api\.[\w\.]+)'"
matches = re.findall(stringing_regex, JS_INIT_STR)
for match in matches:
    JS_INIT_STR = JS_INIT_STR.replace("'" + match + "'", match)

print(JS_INIT_STR)

result = f"""
# Automaticly generated code. 
# Changes here can get overwritten!

{"".join(all_imports)}

class Api:
{INDENT}def __init__(self, window):
        self._window = window
{all_methods}

JS_INIT_STRING = \"{JS_INIT_STR}\"
"""


with open(os.path.join(dir_path, "../generated.py"), "w") as f:
    f.write(result)

# print(json.dumps(class_methods))
