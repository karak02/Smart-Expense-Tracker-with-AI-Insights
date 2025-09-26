from pydantic import BaseModel

class Tranjuction(BaseModel):
    amount:int
    category: str
    description:str
    is_income:bool
    date:str