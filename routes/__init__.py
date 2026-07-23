from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
user_bp = Blueprint('users', __name__)
reflection_bp = Blueprint('reflections', __name__)
tag_bp = Blueprint('tags', __name__)
mood_bp = Blueprint('moods', __name__)
