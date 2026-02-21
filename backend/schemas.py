from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


class UserCreate(BaseModel):
    user_id: str
    password: str


class UserLogin(BaseModel):
    user_id: str
    password: str


class UserResponse(BaseModel):
    id: int
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)



class PlayerCreate(BaseModel):
    name: str


class PlayerResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ScoreCreate(BaseModel):
    player_id: int
    score: int


class ScoreResponse(BaseModel):
    player_id: int
    score: int

    model_config = ConfigDict(from_attributes=True)


class RoundCreate(BaseModel):
    round_number: int
    scores: List[ScoreCreate]


class RoundResponse(BaseModel):
    id: int
    round_number: int
    created_at: datetime
    scores: List[ScoreResponse]

    model_config = ConfigDict(from_attributes=True)


class GameCreate(BaseModel):
    name: Optional[str] = None
    players: List[PlayerCreate]


class GameResponse(BaseModel):
    id: int
    name: Optional[str]
    created_at: datetime

    players: List[PlayerResponse]
    rounds: List[RoundResponse]

    model_config = ConfigDict(from_attributes=True)


class LeaderboardEntry(BaseModel):
    player_id: int
    player_name: str
    total_score: int


class LeaderboardResponse(BaseModel):
    leaderboard: List[LeaderboardEntry]