from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    games = relationship("Game", back_populates="owner", cascade="all, delete")

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="games")
    players = relationship("Player", back_populates="game", cascade="all, delete")
    rounds = relationship("Round", back_populates="game", cascade="all, delete")


class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)

    # Relationships
    game = relationship("Game", back_populates="players")
    scores = relationship("Score", back_populates="player", cascade="all, delete")

class Round(Base):
    __tablename__ = "rounds"

    id = Column(Integer, primary_key=True, index=True)
    round_number = Column(Integer, nullable=False)

    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    game = relationship("Game", back_populates="rounds")
    scores = relationship("Score", back_populates="round", cascade="all, delete")


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)

    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    round_id = Column(Integer, ForeignKey("rounds.id"), nullable=False)

    score = Column(Integer, nullable=False)

    # Relationships
    player = relationship("Player", back_populates="scores")
    round = relationship("Round", back_populates="scores")