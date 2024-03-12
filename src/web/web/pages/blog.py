import reflex as rx
from web.templates import webpage

@webpage(path="/blog", title="Blog")
def blog():
    return rx.box(
        blog_content()
    )

def blog_content():
    return rx.center(
        rx.vstack(
            rx.heading("Blog", size="9"),
            align="center",
            spacing="7",
        ),
        height="100vh"
    )


