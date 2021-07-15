from flask import Flask


app = Flask(__name__, static_folder=".", static_url_path="")


@app.route("/")
def home():
    return app.send_static_file("index.html")

