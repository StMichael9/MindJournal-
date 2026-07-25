from flask import request
from . import user_bp
from models import User
from schemas import UserSchema

@user_bp.get('/')
def get_users():
    pass

# this file is optional 