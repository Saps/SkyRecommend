# -*- coding: utf-8 -*-
from marshmallow import Schema
from marshmallow import fields


class SUser(Schema):
    id = fields.Integer()
    username = fields.String()
    userpass = fields.String()
    userinfo = fields.String()
    usershortinfo = fields.String()
    firstname = fields.String()
    lastname = fields.String()
    email = fields.String()
    admin_level = fields.Integer()
    params = fields.Dict()


class SUser2(Schema):
    id = fields.Integer()
    username = fields.String()
    userinfo = fields.String()
    usershortinfo = fields.String()
    firstname = fields.String()
    lastname = fields.String()
    email = fields.String()
    admin_level = fields.Integer()
