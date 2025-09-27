from fastapi import FastAPI,HTTPException
from models import Tranjuction
from Smart_Expense_Tracker_with_AI_Insights.Backend.app.database import Tranjuction_collection
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
     allow_credentials=True,     # allow cookies/auth headers
    allow_methods=["*"],        # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"welcome to Ankon's apis🚀🚀😎"}

@app.post("/transactions/", response_model=Tranjuction)
async def create_tranjuction(tranjuction: Tranjuction):
    tranjuction_dict = tranjuction.dict()
    await Tranjuction_collection.insert_one(tranjuction_dict)
    return tranjuction


@app.get("/transactions/", response_model=list[Tranjuction])
async def get_tranjuctions(is_income: bool | None = None):
    query = {}
    if is_income is not None:
        query["is_income"] = is_income

    tranjuctions = []
    async for tranjuction_data in Tranjuction_collection.find(query):
        if 'is_income' in tranjuction_data and isinstance(tranjuction_data['is_income'], str):
            tranjuction_data['is_income'] = tranjuction_data['is_income'].lower() == 'true'
        tranjuctions.append(Tranjuction(**tranjuction_data))
    return tranjuctions
