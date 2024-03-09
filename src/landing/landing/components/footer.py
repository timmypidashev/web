import reflex as rx

def footer():
    return rx.box(
        footer_content(),
        background="#FFF",
        border_top=f"8px solid {rx.color('mauve', 4)};"
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
