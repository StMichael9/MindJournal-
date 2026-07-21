from flask import Flask
import os
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

from models import db

# Load .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)
app.url_map.strict_slashes = False

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/")
def home():
    return {"message": "Backend running"}

if __name__ == "__main__":
    app.run(debug=True)
