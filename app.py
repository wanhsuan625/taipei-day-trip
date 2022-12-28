from flask import *
from flask_cors import CORS
from api.attractionAll import attractionAll
from api.attractionEach import attractionEach
from api.category import category
from api.user import user
from api.booking import booking
from api.order import order

app=Flask(
		__name__,
		static_folder = "static",
		static_url_path = "/"
	)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config["JSON_AS_ASCII"]=False
app.config["JSON_SORT_KEYS"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(attractionAll)
app.register_blueprint(attractionEach)
app.register_blueprint(category)
app.register_blueprint(user)
app.register_blueprint(booking)
app.register_blueprint(order)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


if __name__ == "__main__":
	app.run(port=3000,debug=True)
	# app.run(host="0.0.0.0",port=3000,debug=True)