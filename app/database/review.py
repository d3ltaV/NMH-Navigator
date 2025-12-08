from .db import get_db
from datetime import datetime

class Review:
    def __init__(self, id_, user_id, target_type, target_name, review, rating, created_at):
        self.id = id_
        self.user_id = user_id
        self.target_type = target_type #'workjobs', 'classes', 'cocurriculars'
        self.target_name = target_name  # workjob/class/cocurricular name
        self.review = review
        self.rating = rating
        self.created_at = created_at

    @staticmethod
    def create(user_id, target_type, target_name, review=None, rating=None):
        db = get_db()
        db.execute("""
            INSERT INTO review (user_id, target_type, target_name, review, rating, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, target_type, target_name, review, rating, datetime.now()))
        db.commit()

    @staticmethod
    def target_review(target_type, target_name):
        db = get_db()
        rows = db.execute("""
            SELECT id, user_id, target_type, target_name, review, rating, created_at
            FROM review
            WHERE target_type = ? AND target_name = ?
        """, (target_type, target_name)).fetchall()
        return [Review(*row) for row in rows]

    @staticmethod
    def user_review(user_id):
        db = get_db()
        rows = db.execute("""
            SELECT id, user_id, object_type, object_name, review, rating, created_at
            FROM review
            WHERE user_id = ?
        """, (user_id,)).fetchall()
        return [Review(*row) for row in rows]