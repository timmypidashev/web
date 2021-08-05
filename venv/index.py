from flask import Flask, render_template, request

app = Flask(__name__, template_folder = "templates", static_url_path="/static")

#home page
@app.route("/")
def index():
    return render_template("index.html")