import reflex as rx
from landing.style import *

def navbar():
    return rx.box(
        rx.center(
            rx.vstack(
                rx.heading("Navbar", size="9"),
                align="center",
                spacing="7"
            ),
            border_bottom=f"2px solid {color['white']};",
            height="10vh"
        )
    )
