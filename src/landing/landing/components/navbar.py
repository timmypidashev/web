import reflex as rx


def navbar():
    return rx.flex(
        background = "#FFF",
        border_bottom=f"8px solid {rx.color('mauve', 4)};",
        height="10vh",
        position="fixed",
        width="100%",
        top="0px",
        z_index="5", 
        align_items= "center",
        spacing="6",
        padding= "7px 20px 7px 20px;",
    )
