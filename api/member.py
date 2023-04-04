from flask import *
from flask_bcrypt import Bcrypt
import jwt
import module.connect
import os
from dotenv import load_dotenv
load_dotenv()

jwt_key = os.getenv("jwt_key")
bcrypt = Bcrypt()

member = Blueprint("member", __name__)
connection_pool = module.connect.db_connection()

# --- CHANGE USERNAME --------------------------------------------------------
@member.route("/api/member/username", methods=["POST"])
def member_username():
    getdata = request.get_json()
    username = getdata["username"]
    email = getdata["email"]

    if username == "":
        return jsonify({
            "error": True,
            "message": "請填入名稱"
        }), 400
    
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)

        sql_username = 'UPDATE users SET name = %s WHERE email = %s'
        val_username = (username, email)
        cursor.execute(sql_username , val_username)
        connection_object.commit()
        return jsonify({
            "ok": True,
            "message": "使用者名稱更改成功"
        })

    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    
    finally:
        cursor.close()
        connection_object.close()
