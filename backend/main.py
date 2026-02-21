from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db, engine
from models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def test_db(db: Session = Depends(get_db)):
    return {"message": "DB connected successfully"}