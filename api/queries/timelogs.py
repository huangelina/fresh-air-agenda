from pydantic import BaseModel
from typing import List
from datetime import date
from queries.pool import pool


class TimeLogIn(BaseModel):
    date: date
    goal: int
    time_outside: int
    user_id: int


class TimeLogOut(BaseModel):
    id: int
    date: date
    goal: int
    time_outside: int
    user_id: int


class TimeLogRepository:
    def create(self, timelog: TimeLogIn) -> TimeLogOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    INSERT INTO timelogs
                        (date,goal,time_outside,user_id)
                    VALUES
                        (%s,%s,%s,%s)
                    RETURNING id;
                    """,
                    [
                        timelog.date,
                        timelog.goal,
                        timelog.time_outside,
                        timelog.user_id
                    ]
                )
                id = result.fetchone()[0]
                old_data = timelog.dict()
                return TimeLogOut(id=id, **old_data)

    def get_timelogs_for_user(self, user_id: int) -> List[TimeLogOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT id, date, goal, time_outside, user_id
                        FROM timelogs
                        WHERE user_id = %s
                        """,
                        [user_id]
                    )
                    timeloglist = []
                    rows = db.fetchall()
                    for row in rows:
                        log = {
                            "id": row[0],
                            "date": row[1],
                            "goal": row[2],
                            "time_outside": row[3],
                            "user_id": row[4]
                        }
                        timeloglist.append(log)
                    return timeloglist
        except Exception:
            return {"message": "Could not get all logs"}

    def update(self, id: int, user_id: int, timelog: TimeLogIn) -> TimeLogOut:
        try:
            with pool.connection() as conn:
                with conn.cursor()as db:
                    db.execute(
                        """
                        UPDATE timelogs
                        SET
                            date = %s,
                            goal = %s,
                            time_outside = %s
                        WHERE id = %s AND user_id = %s
                        """,
                        [
                            timelog.date,
                            timelog.goal,
                            timelog.time_outside,
                            id,
                            user_id
                        ]
                    )
                    return self.timelog_in_to_out(id, timelog)
        except Exception as e:
            print(e)
            return {"message": "Could not update timelog"}

    def timelog_in_to_out(self, id, timelog: TimeLogIn):
        old_data = timelog.dict()
        return TimeLogOut(id=id, **old_data)
