import reflex as rx

color = {
    "white": "#ebdbb2",
    "black": "#000000",
    "red": {
        100: "#fb4934",
        200: "#cc241d",
    },
    "green": {
        100: "#b8bb26",
        200: "#98971a",
    },
    "yellow": {
        100: "#fabd2f",
        200: "#d79921",
    },
    "blue": {
        100: "#83a598",
        200: "#458588",
    },
    "purple": { 
        100: "#d3869b",
        200: "#b16286",
    },
    "aqua": {
        100: "#8ec07c",
        200: "#689d6a",
    }
}

style = {
    # Background color
    "background_color": color["black"],
        
    # Text
    rx.text: {
        "font_family": "ComicCode",
        "font_size": 24,
        "color": color["white"]
    },

    # Heading
    rx.heading: {        
        "font_family": "ComicCode",
        "font_size": 32,
        "color": color["white"]
    },

    # Link
    rx.link: {
        "font_family": "ComicCode",
        "font_size": 24,
        "color": color["black"],
        "text_decoration": "none", 
        "_hover": {
            "color": color["green"][100]
        }
    },
}
