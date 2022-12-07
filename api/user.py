from flask import *
import module.connect

# --- Blueprint ----------------------------------
user = Blueprint(
        "user",
        __name__,
        static_folder = "static",
        template_folder = "templates"
)

connection_pool = module.connect.db_connection()

# --- 註冊會員 -----------------------------------------------------------
@user.route("/api/user", method=["POST"])
def signup():
    try:
       
       return jsonify({
            "ok" : True
       }), 200

    except:
        return jsonify({
            "error" : True,
            "message" : "伺服器內部錯誤"
        }), 500

    # finally:
    #     cursor.close()
	# 	connection_object.close()

# --- 取得會員資料 -----------------------------------------------------------
@user.route("/api/user/auth", method=["GET"])
def userData():
    return "hi"