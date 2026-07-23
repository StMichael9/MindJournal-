from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    reflection_entries = db.relationship("ReflectionEntry", backref="user", cascade="all, delete-orphan")
    mood_logs = db.relationship("MoodLog", backref="user", cascade="all, delete-orphan")
    tags = db.relationship("Tag", backref="user", cascade="all, delete-orphan")
      
    @validates("email")
    def validate_username(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Must enter email")
        return value.strip()
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        if not password or password.strip() == "":
            raise ValueError("Must enter password")

        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters")

        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)


    

class ReflectionEntry(db.Model):
    __tablename__ = 'reflection_entry'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )
    reflection_prompt_id = db.Column(db.Integer, db.ForeignKey("reflection_prompt.id"), nullable=False)
    mood_log_id = db.Column(db.Integer, db.ForeignKey("mood_log.id"), nullable=True)

    content = db.Column(db.Text, nullable=False)
    title = db.Column(db.String(225), nullable=False)
    is_favorite = db.Column(db.Boolean, nullable=True, default=False)

    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, 
        nullable=False, 
        server_default=db.func.now(), 
        onupdate=db.func.now()
    )
    
    mood_log = db.relationship("MoodLog", backref="reflection_entry")
    reflection_tags = db.relationship("ReflectionTag", backref="reflection_entry", cascade="all, delete-orphan")
    tags = db.relationship("Tag", secondary="reflection_tag", backref="reflection_entries")

    @validates("content")
    def validate_content(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Must add content")
        return value.strip()
    
    @validates("title")
    def validate_title(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Must enter title")
        return value.strip()


class ReflectionPrompt(db.Model):
    __tablename__ = 'reflection_prompt'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    category = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    @validates("text")
    def validate_text(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Must enter text")
        return value.strip()


class MoodLog(db.Model):
    __tablename__ = 'mood_log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )
    mood_value = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    notes = db.Column(db.Text, nullable=True)

    @validates("mood_value")
    def validate_mood_value(self, key, value):
        if value is None:
            raise ValueError("Must enter a value")
        if value < 1 or value > 10:
            raise ValueError("Must enter a value between 1 - 10")
        return value


class Tag(db.Model):
    __tablename__ = 'tag'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )
    title = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String, nullable=True)

    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime, 
        nullable=False, 
        server_default=db.func.now(), 
        onupdate=db.func.now()
    )

    reflection_tags = db.relationship("ReflectionTag", backref="tag", cascade="all, delete-orphan")

    @validates("title")
    def validate_title(self, key, value):
        if not value or value.strip() == "":
            raise ValueError("Must add a title")
        return value.strip()


class ReflectionTag(db.Model):
    __tablename__ = 'reflection_tag'

    id = db.Column(db.Integer, primary_key=True)

    reflection_entry_id = db.Column(
        db.Integer,
        db.ForeignKey("reflection_entry.id", ondelete="CASCADE"),
        nullable=False
    )

    tag_id = db.Column(
        db.Integer,
        db.ForeignKey("tag.id", ondelete="CASCADE"),
        nullable=False
    )

    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())

    __table_args__ = (
        db.UniqueConstraint('reflection_entry_id', 'tag_id'),
    )
