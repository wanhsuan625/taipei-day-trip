from flask import *
import jwt
from module import connect

order = Blueprint("order" ,__name__)
jwt_key = "secret"

# --- DATABASE CONNECT --------------------------------------------------
# connection_pool = connect.db_connection()

# connection_object = connection_pool.get_connection()
# cursor = connection_object.cursor(dictionary=True)
# sqlbooking_table = "CREATE TABLE IF NOT EXISTS `booking`( \
#                     `id` BIGINT primary key not null auto_increment,\
#                     `userId` BIGINT not null,\
#                     `attractionId` BIGINT not null,\
#                     `date` VARCHAR(255) not null,\
#                     `time` VARCHAR(255) not null,\
#                     `price` VARCHAR(255) not null,\
#                      FOREIGN KEY(userId) REFERENCES users(id)\
#                     );"
# cursor.execute(sqlbooking_table)
# cursor.close()
# connection_object.close()