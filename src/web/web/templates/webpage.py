from typing import Callable
import reflex as rx
from web.route import Route
from web.motion import motion

def webpage(path: str, title: str = "Timothy Pidashev", props=None) -> Callable:
    """This template wraps the webpage with the navbar and footer.

    Args:
        path: The path of the page.
        title: The title of the page.
        props: Props to apply to the template.

    Returns:
        A wrapper function that returns the full webpage.
    """
    props = props or {}

    def webpage(contents: Callable[[], Route]) -> Route:
        """Wrapper to create a templated route.

        Args:
            contents: The function to create the page route.

        Returns:
            The templated route.
        """

        def wrapper(*children, **props) -> rx.Component:
            """The template component.

            Args:
                children: The children components.
                props: The props to apply to the component.

            Returns:
                The component with the template applied.
            """
            # Import here to avoid circular imports.
            from web.components.navbar import navbar
            from web.components.footer import footer

            # Declare the entire page content
            return rx.box(
                motion(
                    rx.box(
                        navbar(),
                        contents(*children, **props),
                        footer(),
                        **props
                    ),
                    initial={"opacity": 0, "y": -50},  # Initial state: transparent and above the screen
                    animate={"opacity": 1, "y": 0, "transition": {"duration": 0.5, "ease": "easeInOut"}},  # Animate opacity to 1 and move down into view
                )
            )

        return Route(
            path=path,
            title=title,
            component=wrapper,
        )

    return webpage
