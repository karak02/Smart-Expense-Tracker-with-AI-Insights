from motor.motor_asyncio import AsyncIOMotorClient

MOTOR_DETAILS = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MOTOR_DETAILS)

