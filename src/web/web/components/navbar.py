import reflex as rx
from web.style import *

def navbar():
    return rx.box(
        rx.center(
            rx.flex(
                rx.link(
                    rx.text("About", color=color["white"]), href="/about"
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Projects", color=color["white"]), href="/projects"
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Resume", color=color["white"]), href="/resume"
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Blog", color=color["white"]), href="/blog"
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Shop", color=color["white"]), href="shop"
                )
            ),
            spacing="7",
        )
    )
