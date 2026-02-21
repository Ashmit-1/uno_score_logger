from sqlalchemy.orm import Session
from sqlalchemy import func

from models import Game, Player, Round, Score, User
from schemas import GameCreate, RoundCreate

def create_game(db: Session, user: User, game_data: GameCreate):
    game = Game(
        name=game_data.name,
        owner_id=user.id
    )

    db.add(game)
    db.commit()
    db.refresh(game)

    # Add players
    for p in game_data.players:
        player = Player(name=p.name, game_id=game.id)
        db.add(player)

    db.commit()
    db.refresh(game)

    return game


def get_user_games(db: Session, user: User):
    return db.query(Game).filter(Game.owner_id == user.id).all()


def get_game_by_id(db: Session, user: User, game_id: int):
    game = db.query(Game).filter(
        Game.id == game_id,
        Game.owner_id == user.id
    ).first()

    if not game:
        raise Exception("Game not found")

    return game

def add_round(db: Session, user: User, game_id: int, round_data: RoundCreate):
    game = get_game_by_id(db, user, game_id)

    round_obj = Round(
        round_number=round_data.round_number,
        game_id=game.id
    )

    db.add(round_obj)
    db.commit()
    db.refresh(round_obj)

    # Add scores
    for s in round_data.scores:
        score = Score(
            player_id=s.player_id,
            round_id=round_obj.id,
            score=s.score
        )
        db.add(score)

    db.commit()

    return {"message": "Round added successfully"}


def get_leaderboard(db: Session, user: User, game_id: int):
    game = get_game_by_id(db, user, game_id)

    results = (
        db.query(
            Player.id,
            Player.name,
            func.sum(Score.score).label("total_score")
        )
        .join(Score, Player.id == Score.player_id)
        .join(Round, Round.id == Score.round_id)
        .filter(Round.game_id == game.id)
        .group_by(Player.id)
        .order_by(func.sum(Score.score))
        .all()
    )

    leaderboard = [
        {
            "player_id": r.id,
            "player_name": r.name,
            "total_score": r.total_score or 0
        }
        for r in results
    ]

    return {"leaderboard": leaderboard}