from app import app
from models import db, User, ReflectionEntry, MoodLog, Tag, ReflectionTag, ReflectionPrompt
from werkzeug.security import generate_password_hash

with app.app_context():
    db.drop_all()
    db.create_all()

    user = User(
        email="test@example.com",
        password_hash="password123"
    )
    db.session.add(user)
    db.session.commit()

    prompt = ReflectionPrompt(text="What are you thinking about today?", category="General")
    db.session.add(prompt)
    db.session.commit()

    r1 = ReflectionEntry(
        user_id=user.id,
        reflection_prompt_id=prompt.id,
        content="Feeling focused and ready to work.",
        title="Morning Reflection"
    )
    r2 = ReflectionEntry(
        user_id=user.id,
        reflection_prompt_id=prompt.id,
        content="A bit tired but still productive.",
        title="Afternoon Reflection"
    )
    r3 = ReflectionEntry(
        user_id=user.id,
        reflection_prompt_id=prompt.id,
        content="Grateful for the progress today.",
        title="Evening Reflection"
    )
    db.session.add_all([r1, r2, r3])
    db.session.commit()

    m1 = MoodLog(user_id=user.id, mood_value=8, notes="Feeling good")
    m2 = MoodLog(user_id=user.id, mood_value=5, notes="A little tired")
    m3 = MoodLog(user_id=user.id, mood_value=9, notes="Great day")
    db.session.add_all([m1, m2, m3])
    db.session.commit()

    t1 = Tag(user_id=user.id, title="Work", color="#FF5733")
    t2 = Tag(user_id=user.id, title="Health", color="#33C1FF")
    t3 = Tag(user_id=user.id, title="Gratitude", color="#33FF57")
    db.session.add_all([t1, t2, t3])
    db.session.commit()

    db.session.add_all([
        ReflectionTag(tag_id=t1.id, reflection_entry_id=r1.id),
        ReflectionTag(tag_id=t2.id, reflection_entry_id=r2.id),
        ReflectionTag(tag_id=t3.id, reflection_entry_id=r3.id)
    ])
    db.session.commit()
