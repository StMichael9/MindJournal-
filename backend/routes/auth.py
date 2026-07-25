from flask import request, session
from . import auth_bp
from models import User, db

@auth_bp.post('/signup')
def signup():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user:
        return {"error": "User already exists"}, 422

    try:
        new_user = User(email=email)
        new_user.password_hash = password
        db.session.add(new_user)
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        return {"error": str(e)}, 422

    return {"id": new_user.id, "email": new_user.email}, 201

    

@auth_bp.post('/login')
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not password or not user or not user.authenticate(password):
        return {"error": "Invalid email or password"}, 401

    session['user_id'] = user.id
    return {"id": user.id, "email": user.email}, 200 


@auth_bp.get('/check_session')
def check_session():
    user_id = session.get("user_id")
    if not user_id:
        return {}, 204

    user = db.session.get(User, user_id)
    return {"id": user.id, "email": user.email}, 200

@auth_bp.post('/logout')
def logout():
    session.clear()
    return {}, 200
