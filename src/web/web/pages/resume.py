import reflex as rx
from web.templates import webpage

@webpage(path="/resume", title="Resume")
def resume():
    return rx.box(
        resume_content()
    )

def resume_content():
    return rx.center(
        rx.vstack(
            rx.heading("Resume", size="9"),
            align="center",
            spacing="7",
        ),
        height="100vh"
    )
