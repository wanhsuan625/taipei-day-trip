from flask import *
from flask_bcrypt import Bcrypt
import jwt
import module.connect
import os
from dotenv import load_dotenv
load_dotenv()

jwt_key = os.getenv("jwt_key")
bcrypt = Bcrypt()

user = Blueprint("user", __name__)