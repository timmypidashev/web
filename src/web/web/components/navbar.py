import reflex as rx
from web.style import *

def navbar():
    return rx.box(
        rx.center(
            rx.flex(
                rx.link(
                    rx.text("About", href="/about")
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Projects", href="/projects")
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Resume", href="/resume")
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Blog", href="/blog")
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Shop", href="shop")
                )
            ),
            spacing="7",
        )
    )
