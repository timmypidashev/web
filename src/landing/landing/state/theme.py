import reflex as rx

from .state import State

class ThemeState(State):
    """State for the global theme"""
    theme: str = "day"

    def toggle_theme(self):
        self.theme == "day" if self.theme != "day" else self.theme == "night"
