import os
from datetime import datetime, timedelta
from typing import Optional

from passlib.context import CryptContext
from jose import jwt


# --- configure via env in production ---
SECRET_KEY = os.environ.get("SECRET_KEY", "your_default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

pwd_context = CryptContext(schemes = ["bcrypt"],deprecated = "auto")

def veryfy_password(plane_pass:str,hased_pass:str)-> bool:
    return pwd_context.verify(plane_pass,hased_pass)

def get_pass_hash(password: str)-> str:
    return pwd_context.hash(password)

def create_access_token(subject:str,expires_delta: Optional[timedelta]= None)->str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": str(subject), "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
