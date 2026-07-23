from flask import request, session
from marshmallow import ValidationError
from . import reflection_bp
from models import db, ReflectionEntry, MoodLog, Tag
from schemas import ReflectionEntrySchema
from sqlalchemy.exc import SQLAlchemyError

reflection_schema = ReflectionEntrySchema()
reflections_schema = ReflectionEntrySchema(many=True)


@reflection_bp.before_request
def require_login():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401


@reflection_bp.get('/')
def get_reflections():
    reflection_entries = ReflectionEntry.query.filter_by(
        user_id=session['user_id']
    ).all()
    result = reflections_schema.dump(reflection_entries)
    return result, 200


@reflection_bp.get('/<int:id>')
def get_reflection(id):
    reflection_entry = ReflectionEntry.query.filter_by(
        id=id,
        user_id=session['user_id']
    ).first_or_404()
    result = reflection_schema.dump(reflection_entry)
    return result, 200


@reflection_bp.post('/')
def create_reflection():
    data = request.get_json() or {}

    try:
        validated_data = reflection_schema.load(data)
    except ValidationError as e:
        return {"errors": e.messages}, 400

    new_reflection = ReflectionEntry(
        **validated_data,
        user_id=session['user_id']
    )
    db.session.add(new_reflection)

    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400

    result = reflection_schema.dump(new_reflection)
    return result, 201


@reflection_bp.patch('/<int:id>')
def update_reflection(id):
    data = request.get_json() or {}

    try:
        validated_data = reflection_schema.load(data, partial=True)
    except ValidationError as e:
        return {"errors": e.messages}, 400

    reflection_entry = ReflectionEntry.query.filter_by(
        id=id,
        user_id=session['user_id']
    ).first_or_404()

    for field, value in validated_data.items():
        setattr(reflection_entry, field, value)

    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400

    return reflection_schema.dump(reflection_entry), 200


@reflection_bp.delete('/<int:id>')
def delete_reflection(id):
    reflection_entry = ReflectionEntry.query.filter_by(
        id=id,
        user_id=session['user_id']
    ).first_or_404()

    db.session.delete(reflection_entry)

    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400

    return {}, 204
