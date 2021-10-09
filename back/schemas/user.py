# -*- coding: utf-8 -*-
from marshmallow import Schema
from marshmallow import fields


class SUser(Schema):
    id = fields.Integer()
    username = fields.String()
    email = fields.String()
    params = fields.Dict()
    role = fields.String()


