from datetime import timedelta
from fastapi import APIRouter,HTTPException
from app.utils.security import create_access_token, get_pass_hash, verify_password
from app.models.user import UserCreate, UserLogin
from app.services.autth_service import create_user, get_user_by_username


router = APIRouter()
# ---------------- SIGNUP ----------------
@router.post("/register")
async def register_user(user:UserCreate):
    existing_user = await get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    

    # Hash password
    hashed_password = get_pass_hash(user.password)

    # Create new user with hashed password
    user_data = user.dict()
    user_data["hashed_password"] = hashed_password
    # Create new user
    new_user = await create_user(user_data)
    new_user["_id"] = str(new_user["_id"])
    return {"message": "user created successfully", "user": new_user}

# ---------------- LOGIN ----------------
@router.post("/login")
async def login(user: UserLogin):
    # 1. Find user by username
    find_user = await get_user_by_username(user.username)

    # 2. Check if user exists & has hashed_password field
    if not find_user or "hashed_password" not in find_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 3. Verify plain password with hashed_password
    if not verify_password(user.password, find_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credential")

    # 4. Generate JWT if verified
    token = create_access_token(subject=find_user["username"])
    return {"access_token": token, "token_type": "bearer"}
