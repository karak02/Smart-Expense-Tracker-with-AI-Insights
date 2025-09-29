from fastapi import APIRouter, Depends , HTTPException
from bson import ObjectId
from app.utils.auth import get_current_user
from app.services.transaction_service import Transaction_collection
from app.models.transaction import TranjuctionIn,TranjuctionOut

router = APIRouter()

@router.post("/transactions/",response_model=TranjuctionOut)
async def create_transaction(Transaction: TranjuctionIn, current_user=Depends(get_current_user)):
    new_transation = Transaction.dict()
    new_transation["user_id"] = str(current_user["_id"])
    add = await Transaction_collection.insert_one(new_transation)  
    return {**new_transation,"id":str(add.inserted_id)}


@router.get("/transactions/", response_model=list[TranjuctionOut])
async def get_transactions(current_user=Depends(get_current_user)):
    # Fetch all documents (limit can be added later)
    results = Transaction_collection.find({"user_id":str(current_user["_id"])})
    array = []
    async for t in results:
        t["id"]= str(t["_id"])
        del t["_id"] # remove original ObjectId (not JSON serializable)
        array.append(t)
    return array

@router.get("/transations/{id}", response_model=TranjuctionOut)
async def get_one_transaction(id:str):
    # Validate MongoDB ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    #fetch one by one
    getOneResults = await Transaction_collection.find_one({"_id":ObjectId(id)})

    # If not found id then return not found error
    if not getOneResults:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if getOneResults:
        getOneResults["id"]=str(getOneResults["_id"])
        del getOneResults["_id"]
    return getOneResults

@router.put("/transactions/{id}", response_model=TranjuctionOut)
async def update_transaction(id:str, transaction_updated: TranjuctionIn):

    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    # Convert update data to dict (only provided fields)
    updated_data = transaction_updated.dict(exclude_unset=True)

    result = await  Transaction_collection.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set":updated_data},
        return_document=True  # Return the updated document
    )

    if not result:
        raise HTTPException(status_code=404, detail="Transaction not found")

    result["id"]=str(result["_id"])
    del result["_id"]

    return result

@router.delete("/transactions/{id}")
async def delete_transaction(id:str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    delete_transaction = await Transaction_collection.find_one_and_delete({"_id":ObjectId(id)})

    if not delete_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return {"Transaction deleted successfully"}
