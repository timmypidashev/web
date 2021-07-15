from flask import Flask


app = Flask(__name__)


@app.route("/")
def home():
    return "Home Page Route"

@app.route("/api")
def api():
    with open("data.json", mode="r") as my_file:
        text = my_file.read()
        return text
