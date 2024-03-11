import reflex as rx
from landing.templates import webpage

# TODO: Add a go back here link

@webpage(path="/404", title="Page Not Found")
def page404():
    return rx.center(
        rx.vstack(
            rx.heading("Whoops, this page doesn't exist...", size="9"),
            rx.spacer(),
        ),
        height="100vh",
        width="100%",
    )
