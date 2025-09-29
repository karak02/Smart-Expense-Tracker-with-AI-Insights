from fastapi import FastAPI
from app.routes import transaction,auth
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


# Register routers
app.include_router(auth.router, prefix="/api")    
app.include_router(transaction.router, prefix="/api")

