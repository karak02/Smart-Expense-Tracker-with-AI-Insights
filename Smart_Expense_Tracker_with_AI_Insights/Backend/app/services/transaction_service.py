from app.database import client

database = client.transaction_db

Transaction_collection = database.get_collection("Transactions")
