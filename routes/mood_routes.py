from flask import request, session, Blueprint
from marshmallow import ValidationError
from models import db, MoodLog
from schemas import MoodLogSchema
from sqlalchemy.exc import SQLAlchemyError

mood_log_bp = Blueprint("mood_log_bp", __name__)

mood_log_schema = MoodLogSchema()
mood_logs_schema = MoodLogSchema(many=True)


@mood_log_bp.before_request
def require_login():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401

@mood_log_bp.get('/')
def get_mood_logs():
    mood_logs = MoodLog.query.filter_by(user_id=session['user_id']).all()
    result = mood_logs_schema.dump(mood_logs)
    return result, 200

@mood_log_bp.get('/<int:id>')
def get_mood_log(id):
    mood_log = MoodLog.query.filter_by(id=id, user_id=session['user_id'] ).first_or_404()
    result = mood_log_schema.dump(mood_log)
    return result, 200

@mood_log_bp.post('/')
def create_mood_log():
    data = request.get_json() or {}
    try:
        validated_data = mood_log_schema.load(data)
    except ValidationError as e:
        return {"errors": e.messages}, 400
    new_mood_log = MoodLog(**validated_data,user_id=session['user_id'])
    db.session.add(new_mood_log)
    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400
    result = mood_log_schema.dump(new_mood_log)
    return result, 201 


@mood_log_bp.patch('/<int:id>')
def update_mood_log(id):
    data = request.get_json() or {}
    try:
        validated_data = mood_log_schema.load(data, partial=True)
    except ValidationError as e:
        return {"errors": e.messages}, 400
    
    mood_log = MoodLog.query.filter_by(
        id=id,
        user_id=session['user_id']
    ).first_or_404()

    for field, value in validated_data.items():
        setattr(mood_log, field, value)

    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400

    return mood_log_schema.dump(mood_log), 200


@mood_log_bp.delete('/<int:id>')
def delete_mood_log(id):
    mood_log = MoodLog.query.filter_by(id=id, user_id=session['user_id'] ).first_or_404()
    db.session.delete(mood_log)
    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400

    return {}, 204
