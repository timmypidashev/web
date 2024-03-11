import reflex as rx
from .state import State
from landing.style import *
from typing import Dict, Any, List


class ThemeState(State):
    """App Theme State"""

    current_theme: int = 0

    themes = {
        0: {"background_color": "#282828"},
        1: {"background_color": "#000000"},
    }

    @rx.var
    def theme(self) -> dict:
        return self.themes[self.current_theme]
