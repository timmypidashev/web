import reflex as rx
from landing.components import navbar
from landing.templates import webpage

@webpage(path="/", title="Timothy Pidashev")
def index() -> rx.Component:
    return rx.box(
        index_content()
    )

def index_content():
    return rx.center(
        rx.vstack(
            rx.heading("Index", size="9"),
            align="center",
            spacing="7",
        ),
        height="100vh"
    )
