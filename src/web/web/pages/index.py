import reflex as rx
from web.components import navbar
from web.templates import webpage
from web.motion import motion

@webpage(path="/", title="Timothy Pidashev")
def index() -> rx.Component:
    return rx.box(
        hero_section_1(),
        hero_section_2(),
        hero_section_3()
    )

def hero_section_1():
    return rx.center(
        rx.vstack(  # Using stack instead of vstack for scrollability
            motion(  # Wrap the text with motion to apply animation
                rx.heading(
                    "Hello, Im",
                    style={
                        "text_align": "center",
                        "line_height": "1.2em",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "@media (max-width: 768px)": {"font_size": "3em"},
                        "@media (min-width: 769px)": {"font_size": "5em"},
                        "text_shadow": "3px 2px 2px rgba(199, 130, 59, 0.15);"
                    }
                ),
                initial={"opacity": 0, "y": 50},  # Initial styles (hidden and moved down)
                animate={"opacity": 1, "y": 0},  # Animation styles (fade in and move up)
                transition={"type": "tween", "duration": 1, "delay": 0.5},  # Animation transition (smooth transition)
            ),
            motion(
                rx.heading(
                    "Timothy",
                    style={
                        "text_align": "center",
                        "line_height": "1.2em",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "@media (max-width: 768px)": {"font_size": "3em"},
                        "@media (min-width: 769px)": {"font_size": "5em"},
                        "text_shadow": "3px 2px 2px rgba(199, 130, 59, 0.15);"
                    }
                ),
                initial={"opacity": 0, "y": 50},
                animate={"opacity": 1, "y": 0},
                transition={"type": "tween", "duration": 1, "delay": 0.5}
            ),
            motion(
                rx.heading(
                    "Pidashev",
                    style={
                        "font_size": "6vw",
                        "text_align": "center",
                        "line_height": "1.2em",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "@media (max-width: 768px)": {"font_size": "3em"},
                        "@media (min-width: 769px)": {"font_size": "5em"},
                        "text_shadow": "3px 2px 2px rgba(199, 130, 59, 0.15);"
                    }
                ),
                initial={"opacity": 0, "y": 50},
                animate={"opacity": 1, "y": 0},
                transition={"type": "tween", "duration": 1, "delay": 0.5}
            ),
            align="center",
            overflow="auto",  # Enable scrolling
        ),
        height="100vh"
    )

def hero_section_2():
    return rx.center(
        rx.vstack(
            motion(
                rx.heading(
                    "A 19 year old",
                    style={
                        "text_align": "center",
                        "line_height": "1.2em",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "@media (max-width: 768px)": {"font_size": "2.5em"},
                        "@media (min-width: 769px)": {"font_size": "5em"},
                        "text_shadow": "3px 2px 2px rgba(199, 130, 59, 0.15);"
                    }
                ),
                initial={"opacity": 0, "y": 50},
                animate={"opacity": 1, "y": 0},
                transition={"type": "tween", "duration": 1, "delay": 0.5}
            ),
            motion(
                rx.heading(
                    "on an epic journey",
                    style={
                        "text_align": "center",
                        "line_height": "1.2em",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "@media (max-width: 768px)": {"font_size": "2.5em"},
                        "@media (min-width: 769px)": {"font_size": "5em"},
                        "text_shadow": "3px 2px 2px rgba(199, 130, 59, 0.15);"
                    }
                ),
                initial={"opacity": 0, "y": 50},
                animate={"opacity": 1, "y": 0},
                transition={"type": "tween", "duration": 1, "delay": 0.5}
            ),
            align="center",
            overflow="auto"
        ),
        height="100vh"
    )

def hero_section_3():
    return rx.center(
        rx.vstack(
            motion(
                rx.heading(
                    "to become a",
                    style={
                        "text_align": "center",
                        "line_height": "1.2em",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "@media (max-width: 768px)": {"font_size": "2.5em"},
                        "@media (min-width: 769px)": {"font_size": "5em"},
                        "text_shadow": "3px 2px 2px rgba(199, 130, 59, 0.15);"
                    }
                ),
                initial={"opacity": 0, "y": 50},
                animate={"opacity": 1, "y": 0},
                transition={"type": "tween", "duration": 1, "delay": 0.5}
            ),
            motion(
                rx.heading(
                    "software engineer!",
                    style={
                        "text_align": "center",
                        "line_height": "1.2em",
                        "white-space": "nowrap",
                        "overflow": "hidden",
                        "@media (max-width: 768px)": {"font_size": "2.5em"},
                        "@media (min-width: 769px)": {"font_size": "5em"},
                        "text_shadow": "3px 2px 2px rgba(199, 130, 59, 0.15);"
                    }
                ),
                initial={"opacity": 0, "y": 50},
                animate={"opacity": 1, "y": 0},
                transition={"type": "tween", "duration": 1, "delay": 0.5}
            ),
            align="center",
            overflow="auto",
        ),
        height="100vh"
    )
