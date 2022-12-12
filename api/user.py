from flask import *
from flask_bcrypt import Bcrypt
import jwt
import module.connect

bcrypt = Bcrypt()
user = Blueprint("user", __name__)
jwt_key = "secret"

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
                "message" : "姓名、信箱或密碼尚未填寫"
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
    cookieToken = request.cookies.get("token")   
    if cookieToken:
        decode = jwt.decode(cookieToken, jwt_key, algorithms="HS256")
        return decode
    return jsonify({"data": None})

# --- SIGNIN MEMBER : PUT -----------------------------------------------------------
@user.route("/api/user/auth", methods=["PUT"])
def auth_put():
    try:
        getdata = request.get_json()
        email = getdata["email"]
        password = getdata["password"]

        if email == "" or password == "":
            return jsonify({
                "error": True,
                "message": "信箱、密碼尚未填寫"
            }), 400
        
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()

        # CONFIRM ACCOUNT AND PASSWORD
        sql = "SELECT * FROM users WHERE email = %s;"
        cursor.execute(sql, (email,))
        result = cursor.fetchone()

        if result:
            checkPassword = bcrypt.check_password_hash(result[3], password)
            if checkPassword == True:
                userInfo = {"id": result[0],
                            "name": result[1],
                            "email": result[2]
                        }
                # JWT
                token = jwt.encode(userInfo, jwt_key, algorithm="HS256")
                response = jsonify({"ok": True})
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
    response = jsonify({"ok": True})
    response.delete_cookie("token")
    return response
