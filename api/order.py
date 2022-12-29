from flask import *
import jwt
from datetime import datetime
import requests
from module import connect
import os
from dotenv import load_dotenv
load_dotenv()

jwt_key = os.getenv("jwt_key")
partner_key = os.getenv("partner_key")
merchant_id = os.getenv("merchant_id")

order = Blueprint("order" ,__name__)

# --- DATABASE CONNECT --------------------------------------------------
connection_pool = connect.db_connection()

connection_object = connection_pool.get_connection()
cursor = connection_object.cursor(dictionary=True)
sqlorder_table = "CREATE TABLE IF NOT EXISTS `orders`( \
                    `id` BIGINT primary key not null auto_increment,\
                    `user_id` BIGINT not null,\
                    `order_id` BIGINT not null,\
                    `attraction_id` BIGINT not null,\
                    `date` VARCHAR(255) not null,\
                    `time` VARCHAR(255) not null,\
                    `price` BIGINT not null,\
                    `contact_name` VARCHAR(255) not null,\
                    `contact_email` VARCHAR(255) not null,\
                    `contact_phone` VARCHAR(255) not null,\
                    `status` BIGINT,\
                    FOREIGN KEY(user_id) REFERENCES users(id),\
                    FOREIGN KEY(attraction_id) REFERENCES travel(id)\
                    );"
cursor.execute(sqlorder_table)
cursor.close()
connection_object.close()


# --- OUT OF SERVICE ----------------------------------------------------
@order.route("/thankyou")
def isLogin():
    cookie = request.cookies
    if not cookie :
        return redirect("/")
    return render_template("thankyou.html")
    
# --- ORDER API - POST --------------------------------------------------
@order.route("/api/orders", methods=["POST"])
def order_post():
    getdata = request.get_json()
    get_trip = getdata["order"]["trip"]

    prime = getdata["prime"]
    price = getdata["order"]["price"]
    attraction_id = get_trip["attraction"]["id"]
    date = get_trip["date"]
    time = get_trip["time"]
    contact_name = getdata["order"]["contact"]["name"]
    contact_email = getdata["order"]["contact"]["email"]
    contact_phone = getdata["order"]["contact"]["phone"]

    if contact_name == "" or contact_email == "" or contact_phone == "":
        return jsonify({
            "error": True,
            "message": "聯絡資訊不完整，請重新輸入"
        }), 400

    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)

        # 會員
        token = request.cookies.get("token")

        if token:
            decode = jwt.decode(token, jwt_key, algorithms="HS256")
            user_id = decode["id"]

            # 訂單編號 - 可自訂
            current_time = datetime.now()
            current_time = int(current_time.strftime("%Y%m%d%H%M%S"))

            order_id = current_time + attraction_id + user_id

            # 訂購資訊寫入 orders資料庫
            sql_order = "INSERT INTO\
                        orders(user_id, order_id, attraction_id, date, time,\
                        price, contact_name, contact_email, contact_phone)\
                        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)"
            val_order = (user_id, order_id, attraction_id, date, time, price,
                         contact_name, contact_email, contact_phone)
            cursor.execute(sql_order, val_order)
            connection_object.commit()

            url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
            headers = {
                    "Content-Type": "application/json",
                    "x-api-key": partner_key
                }           
            data = {
                    "prime": prime,
                    "partner_key": partner_key,
                    "merchant_id": merchant_id,
                    "details":"TapPay Test",
                    "amount": price,
                    "cardholder": {
                        "phone_number": "+886" + contact_phone[2:],
                        "name": contact_name,
                        "email": contact_email
                    },
                    "remember": True
                }
            result = requests.post(url, headers=headers, json=data, timeout=30).json()
            print(result)

            if result["status"] == 0:
                sql_status = "UPDATE orders SET status=%s WHERE order_id=%s"
                val_status = (result["status"], order_id)
                cursor.execute(sql_status, val_status)
                connection_object.commit()

                sql_delete = "DELETE FROM booking WHERE userId = %s;"
                val_delete = (user_id,)
                cursor.execute(sql_delete, val_delete)
                connection_object.commit()

                return jsonify({
                            "data": {
                                "number": order_id,
                                "payment": {
                                    "status": result["status"],
                                    "message": "付款成功"
                                }
                            }
                        }), 200
            else:
                return jsonify({
                            "data": {
                                "number": order_id,
                                "payment": {
                                    "status": result["status"],
                                    "message": "付款失敗"
                                }
                            }
                        }), 200
            
        else:
            return jsonify({
                "error": True,
                "message": "未登入系統，請先登入再進行作業"
            }), 403

    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500

    finally:
        cursor.close()
        connection_object.close()

# --- ORDER API - GET ------------------------------------------------------
@order.route("/api/order/<orderNumber>", methods=["GET"])
def order_get(orderNumber):
    try:
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor(dictionary=True)

        # 會員
        token = request.cookies.get("token")

        if token:
            decode = jwt.decode(token, jwt_key, algorithms="HS256")
            user_id = decode["id"]

            # 抓資料
            sql_data = "SELECT orders.* , travel.name, travel.address, travel.images FROM\
                        orders INNER JOIN travel ON orders.attraction_id = travel.id\
                        WHERE orders.user_id = %s AND orders.order_id = %s"
            val_data = (user_id, orderNumber)
            cursor.execute(sql_data, val_data)
            result = cursor.fetchone()

            if result:
                data = {
                    "data": {
                        "number": result["order_id"],
                        "price": result["price"],
                        "trip": {
                            "attraction": {
                                "id": result["attraction_id"],
                                "name": result["name"],
                                "address": result["address"],
                                "image": json.loads(result["images"])[0]
                            },
                            "date": result["date"],
                            "time": result["time"]
                        },
                        "contact": {
                            "name": result["contact_name"],
                            "email": result["contact_email"],
                            "phone": result["contact_phone"]
                        },
                        "status": result["status"]
                    }
                }
                return jsonify(data)

            else:
                return jsonify({
                        "data": None,
                        "message": "查無此訂單，請再次確認訂單編號"    
                    })
        
        else:
            return jsonify({
                "error": True,
                "message": "未登入系統，請先登入再進行作業"
            }), 403

    except Exception as e:
        print(e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
    
    finally:
        cursor.close()
        connection_object.close()