from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Str(required=True)


class TagSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    color = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class ReflectionPromptSchema(Schema):
    id = fields.Int(dump_only=True)
    text = fields.Str(required=True)
    category = fields.Str()
    created_at = fields.DateTime(dump_only=True)


class MoodLogSchema(Schema):
    id = fields.Int(dump_only=True)
    mood_value = fields.Int(required=True)
    notes = fields.Str()
    created_at = fields.DateTime(dump_only=True)


class ReflectionTagSchema(Schema):
    id = fields.Int(dump_only=True)
    reflection_entry_id = fields.Int(required=True)
    tag_id = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)


class ReflectionEntrySchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    content = fields.Str(required=True)
    is_favorite = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    user_id = fields.Int(dump_only=True)
    reflection_prompt_id = fields.Int(required=True)
    mood_log_id = fields.Int(allow_none=True)

    tags = fields.List(fields.Nested(TagSchema), dump_only=True)
    mood_log = fields.Nested(MoodLogSchema, dump_only=True)
    reflection_tags = fields.List(fields.Nested(ReflectionTagSchema), dump_only=True)
