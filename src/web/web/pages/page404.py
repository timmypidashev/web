import reflex as rx
from web.templates import webpage
from web.motion import motion

# TODO: Add a go back here link

@webpage(path="/404", title="Page Not Found")
def page404():
    return rx.box(
        rx.center(
            rx.vstack(
                motion( 
                    rx.heading(
                        "Whoops, this page doesn't exist...", size="9"
                    ),
                    initial={"opacity": 0, "y": -50},  # Initial state: transparent and above the screen
                    animate={"opacity": 1, "y": 0, "transition": {"duration": 0.5, "ease": "easeInOut"}},  # Animate opacity to 1 and move down into view
                    while_hover={"scale": 1.1},  # Enlarge on hover
                )
            ),
            height="100vh",
            width="100%",
        ),
    )
