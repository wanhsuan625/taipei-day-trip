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

# --- DATABASE CONNECT ---------------------------------------------------
connection_pool = module.connect.db_connection()

connection_object = connection_pool.get_connection()
cursor = connection_object.cursor()
sqlTable = "CREATE TABLE IF NOT EXISTS `users`( \
            `id` BIGINT primary key auto_increment,\
            `name` VARCHAR(255) not null,\
            `email` VARCHAR(320) not null,\
            `password` VARCHAR(255) not null\
            );"
cursor.execute(sqlTable)
cursor.close()
connection_object.close()


# --- SIGN_UP MEMBER --------------------------------------------------------
@user.route("/api/user", methods=["POST"])
def signup():
    getdata = request.get_json()
    name = getdata["name"]
    email = getdata["email"]
    password = getdata["password"]

    if name == "" or email == "" or password == "":
        return jsonify({
            "error" : True,
            "message" : "請填寫姓名、信箱或密碼"
        }), 400

    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        #  ENSURING ACCOUNT EXISTS OR NOT 
        sql = "SELECT * FROM users WHERE email = %s;"
        cursor.execute(sql,(email,))    
        result = cursor.fetchone()

        if result:
            return jsonify({
                "error" : True,
                "message" : "此信箱已註冊"
            }), 400
        else:
            hashPassword = bcrypt.generate_password_hash(password).decode('utf-8')
            sql_signup = "INSERT INTO users(name, email, password)\
                        VALUES (%s, %s, %s);"
            val_signup = (name, email, hashPassword)
            cursor.execute(sql_signup, val_signup)
            connection_object.commit()
            return jsonify({
                "ok": True,
                "message" : "信箱註冊成功，請重新登入"
            })

    except Exception as e:
        print(e)
        return jsonify({
            "error" : True,
            "message" : "伺服器內部錯誤"
        }), 500

    finally:
        cursor.close()
        connection_object.close()


# --- SIGNIN MEMBER : GET -----------------------------------------------------------
@user.route("/api/user/auth", methods=["GET"])
def auth_get():
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)

        cookieToken = request.cookies.get("token")
        if cookieToken:
            decode = jwt.decode(cookieToken, jwt_key, algorithms="HS256")
            sql_user = "SELECT * FROM users WHERE email = %s"
            val_user = (decode["email"],)
            cursor.execute(sql_user, val_user)
            result = cursor.fetchone()

            return jsonify({
                "data": {
                    "id": result["id"],
                    "name": result["name"],
                    "email": result["email"]
                }
            })
        return jsonify({"data": None})
    
    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
                "message": "伺服器內部錯誤"
        }), 500

    finally:
        cursor.close()
        connection_object.close()


# --- SIGNIN MEMBER : PUT -----------------------------------------------------------
@user.route("/api/user/auth", methods=["PUT"])
def auth_put():
        getdata = request.get_json()
        email = getdata["email"]
        password = getdata["password"]

        if email == "" or password == "":
            return jsonify({
                "error": True,
                "message": "請填寫信箱、密碼"
            }), 400
        
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary = True)

            # CONFIRM ACCOUNT AND PASSWORD
            sql = "SELECT * FROM users WHERE email = %s;"
            cursor.execute(sql, (email,))
            result = cursor.fetchone()

            if result:
                checkPassword = bcrypt.check_password_hash(result["password"], password)
                if checkPassword == True:
                    userInfo = {"id": result["id"],
                                "name": result["name"],
                                "email": result["email"]
                            }
                    # JWT
                    token = jwt.encode(userInfo, jwt_key, algorithm="HS256")
                    response = make_response(jsonify({"ok": True}))
                    response.set_cookie(key="token", value=token, max_age= 604800)
                    return response
                
                return jsonify({
                    "error": True,
                    "message": "信箱、密碼錯誤"
                }), 400

            else:
                return jsonify({
                    "error": True,
                    "message": "此信箱不存在，請點選註冊"
                }), 400
                    
        except Exception as e:
            print(e)
            return jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
            }), 500

        finally :
            cursor.close()
            connection_object.close()


# --- SIGNIN MEMBER : DELETE -----------------------------------------------------------
@user.route("/api/user/auth", methods=["DELETE"])
def auth_delete():
    response = make_response(jsonify({"ok": True}))
    response.delete_cookie("token")
    return response


# ======================================================================================
# --- CHANGE USERNAME ------------------------------------------------------------------
@user.route("/api/member/username", methods=["POST"])
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

# --- CHANGE PASSWORD ------------------------------------------------------------------
