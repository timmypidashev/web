import reflex as rx
from landing.style import *

def navbar():
    return rx.box(
        rx.center(
            rx.flex(
                rx.link(
                    rx.text("About", color=color["white"]),
                    href="http://about.timmypidashev.localhost"
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Projects", color=color["white"]),
                    href="http://projects.timmypidashev.localhost"
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Resume", color=color["white"]),
                    href="http://resume.timmypidashev.localhost"
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Blog", color=color["white"]),
                    href="http://blog.timmypidashev.localhost"
                )
            ),
            rx.flex(
                rx.link(
                    rx.text("Shop", color=color["white"]),
                    href="http://shop.timmypidashev.localhost"
                )
            ),
            spacing="7",
        )
    )
