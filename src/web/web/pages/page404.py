import reflex as rx
from web.templates import webpage

# TODO: Add a go back here link

@webpage(path="/404", title="Page Not Found")
def page404():
    return rx.box(
        rx.center(
            rx.vstack(
                rx.heading(
                    "Whoops, this page doesn't exist...", size="9"
                ),
                align="center"
            ),
            height="100vh",
            width="100%",
        ),
    )
