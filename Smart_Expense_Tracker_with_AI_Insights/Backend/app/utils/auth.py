from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.services.autth_service import get_user_by_username
from app.utils.security import ALGORITHM, SECRET_KEY


# Tells FastAPI to expect a Bearer token for auth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Function to check and return logged-in user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
