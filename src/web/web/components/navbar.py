import reflex as rx
from web.state import *
from web.style import *


def navbar():
    return rx.box(
        rx.center(
            rx.flex(
                rx.link("Home", href="/")
            ),
            rx.flex(
                rx.link("Projects", href="/projects"),
            ),
            rx.flex(
                rx.link("Resume", href="/resume")
            ),
            rx.flex(
                rx.link("Blog", href="/blog")
            ),
            rx.flex(
                rx.link("Shop", href="/shop")
            ),
            spacing="7",
        )
    )

