from flask import *
import module.connect

# --- Blueprint -------------------------------------------
attractionEach = Blueprint("attractionEach", __name__)


# --- DATABASE CONNECT ------------------------------------
connection_pool = module.connect.db_connection()


# --- API OF EACH ATTRACTION -------------------------------
@attractionEach.route("/api/attraction/<attractionId>")
def attractionID(attractionId):
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		
		sql_count = "select distinct id from travel"
		cursor.execute(sql_count)
		result_count = cursor.fetchall()

		sql_id = "select * from travel where id = %s"
		val_id = (attractionId,)
		cursor.execute(sql_id, val_id)
		result_id = cursor.fetchall()
		
		if (int(attractionId),) not in result_count:
			return jsonify({
				"error": True,
				"message": "景點編號不存在"
			}), 400

		item = {
				"id": result_id[0][0],
				"name": result_id[0][1],
				"category": result_id[0][2],
				"description": result_id[0][3],
				"address": result_id[0][4],
				"transport": result_id[0][5],
				"mrt": result_id[0][6],
				"lat": result_id[0][7],
				"lng": result_id[0][8],
				"images": json.loads(result_id[0][9])
			}
		data = {"data": item}

		return jsonify(data)
	
	except:
		return jsonify({
			"error": True,
			"message": "伺服器內部錯誤"
		}), 500
	
	finally:
		cursor.close()
		connection_object.close()