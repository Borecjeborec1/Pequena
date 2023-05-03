from setuptools import setup, find_packages

VERSION = "0.0.44"
DESCRIPTION = 'Lightweight desktop app framework'
with open("Readme.md", "r") as fh:
    LONG_DESCRIPTION = fh.read()

setup(
    name="Pequena",
    version=VERSION,
    author="borecjeborec1",
    author_email="<atzuki@protonmail.com>",
    description=DESCRIPTION,
    long_description=LONG_DESCRIPTION,
    long_description_content_type="text/markdown",
    packages=find_packages(),
    install_requires=[
        'pythonnet ; sys_platform == "win32"',
        'pyobjc-core ; sys_platform == "darwin"',
        'pyobjc-framework-Cocoa ; sys_platform == "darwin"',
        'pyobjc-framework-WebKit ; sys_platform == "darwin"',
        'QtPy ; sys_platform == "openbsd6"',
        'importlib_resources; python_version < "3.7"',
        'proxy_tools',
        'bottle'
    ],
    keywords=['python'],
    classifiers=[
        "Development Status :: 1 - Planning",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3",
        "Operating System :: Unix",
        "Operating System :: MacOS :: MacOS X",
        "Operating System :: Microsoft :: Windows",
    ]
)
