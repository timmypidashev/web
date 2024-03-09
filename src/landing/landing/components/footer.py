import reflex as rx
from landing.style import * 

def footer():
    return rx.box(
        footer_content(),
        border_top=f"2px solid {color['white']};"
    )



def footer_content():
    return rx.center(
        rx.vstack(
            rx.heading("Footer", size="9"),
            align="center",
            spacing="7"
        ),
        height="15vh"
    )
