from pathlib import Path

from flask import Flask, send_from_directory
import os
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

from models import db
from routes.auth import auth_bp
from routes.tag_routes import tag_bp
from routes.reflection_routes import reflection_bp
from routes.mood_routes import mood_log_bp

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"

app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://localhost:5173",
        "https://mindjournal-1.onrender.com"
    ]
)

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")

app.config.from_object(Config)

app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,
)

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_bp, url_prefix="/")
app.register_blueprint(tag_bp, url_prefix="/tags")
app.register_blueprint(reflection_bp, url_prefix="/reflections")
app.register_blueprint(mood_log_bp, url_prefix="/moodlogs")

@app.route("/")
def home():
    index_file = DIST_DIR / "index.html"
    if index_file.exists():
        return send_from_directory(DIST_DIR, "index.html")

    return {"message": "Backend running"}


@app.route("/<path:path>")
def serve_spa(path):
    index_file = DIST_DIR / "index.html"
    if index_file.exists():
        asset_path = DIST_DIR / path
        if asset_path.exists() and asset_path.is_file():
            return send_from_directory(DIST_DIR, path)

        return send_from_directory(DIST_DIR, "index.html")

    return {"error": "Frontend build not found"}, 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)