import random
from functools import wraps
from flask import session, request, redirect, url_for

def _get_random_string(length=12,
                      allowed_chars='abcdefghijklmnopqrstuvwxyz'
                                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'):
    return ''.join(random.choice(allowed_chars) for i in range(length))


def get_secret_key():
    chars = 'sekrret'
    return _get_random_string(50, chars)



