import reflex as rx
from web.components import navbar
from web.templates import webpage
from web.motion import motion

@webpage(path="/", title="Timothy Pidashev")
def index() -> rx.Component:
    return rx.box(
        index_content()
    )

def index_content():
    return rx.center(
        rx.vstack(  # Using stack instead of vstack for scrollability
            motion(  # Wrap the text with motion to apply animation
                rx.heading("Hello, my name is Timothy Pidashev.", size="9"),
                initial={"opacity": 0, "y": 50},  # Initial styles (hidden and moved down)
                animate={"opacity": 1, "y": 0},  # Animation styles (fade in and move up)
                transition={"type": "tween", "duration": 1, "delay": 0.5},  # Animation transition (smooth transition)
            ),
            align="center",
            overflow="auto",  # Enable scrolling
        ),
        height="100vh"
    )
