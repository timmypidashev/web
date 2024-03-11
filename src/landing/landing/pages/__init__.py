from landing.route import Route

from .index import index
from landing.shared.pages import page404

routes = [
    *[r for r in locals().values() if isinstance(r, Route)],
    #*blog_routes,
    #*doc_routes,
]
