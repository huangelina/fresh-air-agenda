from pydantic import BaseModel
from datetime import datetime
from queries.pool import pool

class TimeLogIn(BaseModel):
    date : datetime
    goal: int
    time_outside: int
    user_id: int

class TimeLogOut(BaseModel):
    id: int
    date : datetime
    goal: int
    time_outside: int
    user_id: int



class TimeLogRepository:
    def create(self, timelog:TimeLogIn)->TimeLogOut:
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
