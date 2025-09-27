from pydantic import BaseModel

class TranjuctionIn(BaseModel):
    amount:int
    category: str
    description:str
    is_income:bool
    date:str

class TranjuctionOut(TranjuctionIn):
    id:str