from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, engine
from models import User, Base
from schemas import UserCreate, UserResponse, UserLogin
from auth import hash_password, verify_password, create_access_token, get_current_user
from routers import game

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(game.router)

@app.get("/")
def test_db(db: Session = Depends(get_db)):
    return {"message": "DB connected successfully"}

@app.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.user_id == user.user_id).first()

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        user_id=user.user_id,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user.user_id).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.user_id})

    return {"access_token": token, "token_type": "bearer"}


@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "user_id": current_user.user_id
    }