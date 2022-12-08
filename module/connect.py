import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()

def db_connection():
    dbconfig = {
        "host" : os.getenv("host"),
        "user" : os.getenv("user"),
        "password" : os.getenv("password"),
        "database" : os.getenv("database"),
        "pool_name" : os.getenv("pool_name"),
        "pool_size" : int(os.getenv("pool_size")),
        "pool_reset_session" : os.getenv("pool_reset_session"),
    }
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        **dbconfig
    )
    return connection_pool