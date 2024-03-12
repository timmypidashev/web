from web.route import Route

from .index import index
from .page404 import page404

routes = [
    *[r for r in locals().values() if isinstance(r, Route)],
    #*blog_routes,
    #*doc_routes,
]
