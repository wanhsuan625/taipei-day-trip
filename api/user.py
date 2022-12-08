from flask import *
from flask_bcrypt import Bcrypt
import module.connect

bcrypt = Bcrypt()
user = Blueprint("user", __name__)

# --- DATABASE CONNECT ---------------------------------------------------
connection_pool = module.connect.db_connection()

connection_object = connection_pool.get_connection()
cursor = connection_object.cursor()
sqlTable = "CREATE TABLE IF NOT EXISTS `users`( \
            `id` BIGINT primary key auto_increment,\
            `name` VARCHAR(55) not null,\
            `email` VARCHAR(255) not null,\
            `password` VARCHAR(55) not null\
            );"
cursor.execute(sqlTable)
cursor.close()
connection_object()


# --- SIGN_UP MEMBER --------------------------------------------------------
@user.route("/api/user", methods=["POST"])
def signup():
    try:  
        name = request.json["name"]
        email = request.json["email"]
        password = request.json["password"]

        if name == "" or email == "" or password == "":
            return jsonify({
                "error" : True,
                "message" : "姓名、信箱或密碼尚未填寫"
            }), 400
                
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        
        sql_email = "SELECT * FROM users WHERE email = %s ;"
        cursor.exectue(sql_email,(email,))    
        result_email = cursor.fetchone()

        if result_email:
            return jsonify({
                "error" : True,
                "message" : "此信箱已註冊"
            }), 400


    except:
        return jsonify({
            "error" : True,
            "message" : "伺服器內部錯誤"
        }), 500

    finally:
        cursor.close()
        connection_object.close()

# --- 取得會員資料 -----------------------------------------------------------
