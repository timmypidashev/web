import reflex as rx
from rxconfig import config
from landing.state import *
from landing.pages import *

# Create app instance and add index page.
app = rx.App(
)

for route in routes:
    app.add_page(
        route.component,
        route.path,
        route.title,
        #image="/previews/index_preview.png",
    )
