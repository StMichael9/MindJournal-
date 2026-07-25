from flask import Flask
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

app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://localhost:5173"
    ]
)

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev")

app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_bp, url_prefix="/")
app.register_blueprint(tag_bp, url_prefix="/tags")
app.register_blueprint(reflection_bp, url_prefix="/reflections")
app.register_blueprint(mood_log_bp, url_prefix="/moodlogs")

@app.route("/")
def home():
    return {"message": "Backend running"}

if __name__ == "__main__":
    app.run()
