# -*- coding: utf-8 -*-
from marshmallow import Schema
from marshmallow import fields

class SImageLight(Schema):
    image_pk = fields.Integer()
    people_fk = fields.Integer()


class SPeople(Schema):
    people_pk = fields.Integer()
    a_first = fields.String()
    middle = fields.String()
    a_last = fields.String()
    address = fields.String()
    city = fields.String()
    state = fields.String()
    country = fields.String()
    a_event = fields.String()
    event_date = fields.Date()
    image_pk = fields.Integer()
    count = fields.Integer()


class EdPeople(Schema):
    a_first = fields.String()
    middle = fields.String()
    a_last = fields.String()
    address = fields.String()
    city = fields.String()
    state = fields.String()
    country = fields.String()
    a_event = fields.String()
    event_date = fields.Date()
    image_pk = fields.Integer()
    count = fields.Integer()

class SearchParam(Schema):
    a_first = fields.String()
    middle = fields.String()
    a_last = fields.String()
    address = fields.String()
    city = fields.String()
    state = fields.String()
    country = fields.String()
    phone = fields.String()
    age = fields.Integer()
    a_event = fields.String()
    event_date = fields.DateTime()
