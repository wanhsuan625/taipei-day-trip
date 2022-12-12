from flask import *
import module.connect

# --- Blueprint -------------------------------------------
attractionAll = Blueprint("attractionAll", __name__)


# --- DATABASE CONNECT ------------------------------------
connection_pool = module.connect.db_connection()


# --- API OF ALL ATTRACTIONS -----------------------------------------------------------
@attractionAll.route("/api/attractions")
def attractions():
	page = request.args.get("page",0)
	page = int(page)
	keyword = request.args.get("keyword","")

	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()			

		if keyword:
			# 抓頁數
			keyword_sql = "select count(id) from travel where (category = %s or name like %s)"
			keyword_val = (keyword, "%" + keyword + "%")
			cursor.execute(keyword_sql, keyword_val)
			lastPage = cursor.fetchone()[0] // 12

			# 取資料
			sql_data = "select * from travel where (category = %s or name like %s) limit 12 offset %s"
			val_data = (keyword, "%" + keyword + "%", page * 12)
			cursor.execute(sql_data, val_data)
			result_attractions = cursor.fetchall()

			attractionList = []
			for i in result_attractions:
				item = {
						"id": i[0],
						"name": i[1],
						"category": i[2],
						"description": i[3],
						"address": i[4],
						"transport": i[5],
						"mrt": i[6],
						"lat": i[7],
						"lng": i[8],
						"images": json.loads(i[9])
					}
				attractionList.append(item)
			
			if (page >= lastPage):
				data = {
					"nextPage": None,
					"data":attractionList
				}
				return jsonify(data)
			
			data = {
				"nextPage": page + 1,
				"data":attractionList
			}
			return jsonify(data)
		
		sql_count = "select count(id) from travel"
		cursor.execute(sql_count)
		lastPage = cursor.fetchone()[0] // 12

		sql_data = "select * from travel limit 12 offset %s"
		val_data = (page * 12,)
		cursor.execute(sql_data, val_data)
		result_attractions = cursor.fetchall()
		
		attractionList = []
		for i in result_attractions:
			item = {
					"id": i[0],
					"name": i[1],
					"category": i[2],
					"description": i[3],
					"address": i[4],
					"transport": i[5],
					"mrt": i[6],
					"lat": i[7],
					"lng": i[8],
					"images": json.loads(i[9])
				}
			attractionList.append(item)
		
		if (page >= lastPage):
			data = {
				"nextPage": None,
				"data":attractionList
			}
			return jsonify(data)
		
		data = {
			"nextPage": page + 1,
			"data":attractionList
		}
		return jsonify(data)
	
	except:
		return jsonify({
 			"error": True,
  			"message": "伺服器內部錯誤"
		}), 500

	finally:
		cursor.close()
		connection_object.close()