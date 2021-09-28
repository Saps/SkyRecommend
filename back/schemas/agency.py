# -*- coding: utf-8 -*-
from marshmallow import Schema
from marshmallow import fields


class SAgency(Schema):
    id = fields.Integer()
    agency = fields.String()
    phone = fields.String()
    first_name = fields.String()
    last_name = fields.String()
    street1 = fields.String()
    street2 = fields.String()
    city = fields.String()
    state = fields.String()
    country = fields.String()
    postal_code = fields.String()
    email = fields.String()
    dept_id = fields.String()
    date_applied = fields.Date()


