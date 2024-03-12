"""Manage routing for the application."""

import inspect
import reflex as rx
from reflex.base import Base
from typing import Callable

class Route(Base):
    """A Page Route."""

    # The path of the route.
    path: str

    # The page title.
    title: str | None = None

    # The component to render for the route.
    component: Callable[[], rx.Component]

def get_path(component_function: Callable):
    """Get the path for a page based on the file location.

    Args:
        component_function: The component function for the page.
    """
    module = inspect.getmodule(component_function)

    # Create a path based on the module name.
    return module.__name__.replace(".", "/").replace("_", "-").split("web/pages")[1]
