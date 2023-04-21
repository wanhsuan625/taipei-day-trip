from flask import *
from flask_bcrypt import Bcrypt
import jwt
import module.connect
import os
import re
from dotenv import load_dotenv
load_dotenv()

jwt_key = os.getenv("jwt_key")
bcrypt = Bcrypt()

member = Blueprint("member", __name__)
connection_pool = module.connect.db_connection()

# --- OUT OF SERVICE ----------------------------------------------------
@member.route("/member")
def isLogin():
    cookie = request.cookies
    if not cookie :
        return redirect("/")
    return render_template("member.html")

# --- CHANGE USERNAME ------------------------------------------------------------------
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

        update_username = 'UPDATE users SET name = %s WHERE email = %s'
        update_username_parameter = (username, email)
        cursor.execute(update_username , update_username_parameter)
        connection_object.commit()

        return jsonify({
            "ok": True,
            "message": "使用者名稱更改成功"
        }), 200

    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    
    finally:
        cursor.close()
        connection_object.close()


# --- CHANGE PASSWORD ------------------------------------------------------------------
@member.route("/api/member/password", methods=["POST"])
def member_password():
    getdata = request.get_json()
    email = getdata["email"]
    old_password = getdata["oldpassword"]
    new_password = getdata["newpassword"]
    confirm_password = getdata["confirmpassword"]

    # REGULAR EXPRESSION OF PASSWORD
    password_regex = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$"
    password_match = re.match( password_regex , new_password)

    if old_password == "" or new_password == "" or confirm_password == "":
        return jsonify({
            "error": True,
            "message": "請輸入舊密碼、新密碼或確認密碼"
        }), 400

    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        
        # TAKE ORIGINAL PASSWORD AND CHECK IT
        sql = "SELECT password FROM users WHERE email = %s;"
        cursor.execute(sql, (email,))
        result = cursor.fetchone()
        
        
        check_password = bcrypt.check_password_hash(result["password"], old_password)
        if check_password == True:
            if old_password == new_password :
                return jsonify({
                    "error": True,
                    "message": "舊密碼與新密碼不可相同"
                }), 400
            
            elif password_match == None:
                return jsonify({
                    "error": True,
                    "message": "密碼長度需為8~15位，並且須包含一個大寫字母、一個小寫字母及一個數字"
                }), 400
            
            elif new_password == confirm_password:
                hash_new_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
                cursor.execute( "UPDATE users SET password = %s WHERE email = %s"
                                , ( hash_new_password, email) )
                connection_object.commit()
                return jsonify({
                    "ok": True,
                    "message" : "變更成功"
                }), 200
            
            else:
                return jsonify({
                    "error": True,
                    "message": "確認密碼與新密碼不相符"
                }), 400
        else:    
            return jsonify({
                "error": True,
                "message": "舊密碼輸入錯誤，請重新輸入"
            }), 400

    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    
    finally:
        cursor.close()
        connection_object.close()
