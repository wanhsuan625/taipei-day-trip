from flask import *
import module.connect

# --- Blueprint -------------------------------------------
category = Blueprint("category", __name__)


# --- DATABASE CONNECT ------------------------------------
connection_pool = module.connect.db_connection()


# --- API OF ALL ATTRACTIONS ------------------------------
@category.route("/api/categories")
def categories():
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()

		sql_category = "select distinct category from travel"
		cursor.execute(sql_category)
		result_category = cursor.fetchall()
		
		categoryList = []
		for i in result_category:
			categoryList.append(i[0])
			
		data = {"data": categoryList}
		return jsonify(data)
	
	except:
		return jsonify({
			"error": True,
			"message": "伺服器內部錯誤"
		}), 500
	
	finally:
		cursor.close()
		connection_object.close()