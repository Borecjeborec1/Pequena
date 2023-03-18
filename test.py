import Pequena


def sum(a, b):
    return a + b


Pequena.init("./client/index.html", "Portfolio")
Pequena.expose_function(sum)
Pequena.create_window(width=800, height=600)
