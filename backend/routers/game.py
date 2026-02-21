from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import User
from schemas import GameCreate, GameResponse, RoundCreate, LeaderboardResponse

from services.game_service import (
    create_game,
    get_user_games,
    get_game_by_id,
    add_round,
    get_leaderboard
)

router = APIRouter(prefix="/games", tags=["Games"])

@router.post("/", response_model=GameResponse)
def create_new_game(
    game: GameCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_game(db, current_user, game)

@router.get("/")
def list_games(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_games(db, current_user)

@router.get("/{game_id}", response_model=GameResponse)
def get_game(
    game_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_game_by_id(db, current_user, game_id)


@router.post("/{game_id}/round")
def create_round(
    game_id: int,
    round_data: RoundCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return add_round(db, current_user, game_id, round_data)

@router.get("/{game_id}/leaderboard", response_model=LeaderboardResponse)
def leaderboard(
    game_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_leaderboard(db, current_user, game_id)