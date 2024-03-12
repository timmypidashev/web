import reflex as rx
from web.templates import webpage

@webpage(path="/shop", title="Shop")
def shop():
    return rx.box(
        shop_content()
    )

def shop_content():
    return rx.center(
        rx.vstack(
            rx.heading("Shop", size="9"),
            align="center",
            spacing="7",
        ),
        height="100vh"
    )


