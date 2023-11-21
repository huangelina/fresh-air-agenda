from pydantic import BaseModel
from typing import Optional
from queries.pool import pool
from datetime import datetime

class EventIn(BaseModel):
    name : str
    date: datetime
    image_url: Optional[str]
    description: Optional[str]
    location: str
    hosted_by: int

class EventOut(BaseModel):
    name : str
    date: datetime
    image_url: Optional[str]
    description: Optional[str]
    location: str
    hosted_by: int


class EventQueries:
    def create(self, event: EventIn) -> EventOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO events
                            (name, date, image_url, description, location, hosted_by)
                        VALUES
                            (%s, %s, %s, %s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            event.name,
                            event.date,
                            event.image_url,
                            event.description,
                            event.location,
                            event.hosted_by
                        ]
                    )
                    id = result.fetchone()[0]
                    return self.user_in_to_out(id, event)
        except Exception:
            return {"message": "Create did not work"}

    def user_in_to_out(self, id: int, event: EventIn):
        old_data = event.dict()
        return EventOut(id=id, **old_data)
