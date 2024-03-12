import reflex as rx
from web.templates import webpage

@webpage(path="/projects", title="Projects")
def projects():
    return rx.box(
        projects_content()
    )

def projects_content():
    return rx.center(
        rx.vstack(
            rx.heading("Projects", size="9"),
            align="center",
            spacing="7",
        ),
        height="100vh"
    )
