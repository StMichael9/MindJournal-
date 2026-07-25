from flask import request, session
from marshmallow import ValidationError
from . import tag_bp
from models import db, Tag, ReflectionTag
from schemas import TagSchema
from sqlalchemy.exc import SQLAlchemyError

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)


@tag_bp.before_request
def require_login():
    if 'user_id' not in session:
        return {"error": "Unauthorized"}, 401


@tag_bp.get('/')
def get_tags():
    tags = Tag.query.filter_by(user_id=session['user_id']).all()
    return tags_schema.dump(tags), 200


@tag_bp.get('/<int:id>')
def get_tag(id):
    tag = Tag.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    return tag_schema.dump(tag), 200


@tag_bp.post('/')
def create_tag():
    data = request.get_json() or {}
    try:
        validated_data = tag_schema.load(data)
    except ValidationError as e:
        return {"errors": e.messages}, 400
    new_tag = Tag(**validated_data, user_id=session['user_id'])
    db.session.add(new_tag)
    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400
    return tag_schema.dump(new_tag), 201


@tag_bp.patch('/<int:id>')
def update_tag(id):
    data = request.get_json() or {}
    try:
        validated_data = tag_schema.load(data, partial=True)
    except ValidationError as e:
        return {"errors": e.messages}, 400
    tag = Tag.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    for field, value in validated_data.items():
        setattr(tag, field, value)   
    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400
    return tag_schema.dump(tag), 200


@tag_bp.delete('/<int:id>')
def delete_tag(id):
    tag = Tag.query.filter_by(id=id, user_id=session['user_id']).first_or_404()
    db.session.delete(tag)
    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        return {"error": str(e)}, 400

    return {}, 204


@tag_bp.post('/<int:tag_id>/attach/<int:reflection_id>')
def attach_tag(tag_id, reflection_id):
    tag = Tag.query.filter_by(id=tag_id, user_id=session['user_id']).first_or_404()
    
    from models import ReflectionEntry  
    reflection = ReflectionEntry.query.filter_by(id=reflection_id, user_id=session['user_id']).first_or_404()
    
    existing_link = ReflectionTag.query.filter_by(tag_id=tag_id, reflection_entry_id=reflection_id).first()
    if existing_link:
        return {"message": "Tag already attached"}, 400
        
    new_link = ReflectionTag(tag_id=tag_id, reflection_entry_id=reflection_id)
    db.session.add(new_link)
  
    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        db.session.rollback()
        return {"error": str(e)}, 400        
    return tag_schema.dump(tag), 201




@tag_bp.delete('/<int:tag_id>/detach/<int:reflection_id>')
def detach_tag(tag_id, reflection_id):
    tag = Tag.query.filter_by(id=tag_id, user_id=session['user_id']).first_or_404()
    from models import ReflectionEntry
    reflection = ReflectionEntry.query.filter_by(id=reflection_id, user_id=session['user_id']).first_or_404()
    link = ReflectionTag.query.filter_by(tag_id=tag_id, reflection_entry_id=reflection_id).first_or_404()

    db.session.delete(link)
    try:
        db.session.commit()
    except (ValueError, SQLAlchemyError) as e:
        db.session.rollback()
        return {"error": str(e)}, 400
    return {"message": "Tag detached"}, 204



