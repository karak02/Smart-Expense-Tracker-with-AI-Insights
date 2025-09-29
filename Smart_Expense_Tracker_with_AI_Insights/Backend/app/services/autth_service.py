from app.database import client
from app.utils.security import get_pass_hash
from bson import ObjectId # Import ObjectId

database = client.transaction_db

user_collection = database.get_collection("Users")

async def get_user_by_username(username:str):
    user = await user_collection.find_one({"username":username})
    if user:
        # Convert ObjectId to string to prevent serialization errors
        for key, value in user.items():
            if isinstance(value, ObjectId):
                user[key] = str(value)
    return user
   
async def create_user(user_data:dict):
    # Align password key to "hashed_password" to match auth.py
    user_data["hashed_password"] = get_pass_hash(user_data.pop("password"))
    new_user = await user_collection.insert_one(user_data)
    # Ensure _id is converted to string for consistency
    user_data["_id"] = str(new_user.inserted_id)
    return user_data
