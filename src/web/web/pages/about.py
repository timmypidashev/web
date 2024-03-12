import reflex as rx
from web.templates import webpage

@webpage(path="/about", title="About")
def about():
    return rx.box(
        rx.center(
            rx.vstack(
                rx.heading("About", sixe="9"),
                align="center"
            ),
            height="100vh",
        )
    )
