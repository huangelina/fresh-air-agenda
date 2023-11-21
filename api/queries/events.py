from pydantic import BaseModel
from typing import Optional, Union, List
from datetime import datetime
from queries.pool import pool

class Error(BaseModel):
    message: str

class EventIn(BaseModel):
    name: str
    date: datetime
    image_url: str
    description: Optional[str]
    location: str
    hosted_by: int

class EventOut(BaseModel):
    id: int
    name: str
    date: datetime
    image_url: str
    description: Optional[str]
    location: str
    hosted_by: int

class EventQueries:
    def get_events(self) -> Union[Error, List[EventOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT
                        id,
                        name, 
                        date, 
                        image_url,
                        description,
                        location,
                        hosted_by
                        FROM events
                        """
                    )
                    result = []
                    for record in db:
                        event = EventOut(
                            id=record[0],
                            name=record[1],
                            date=record[2],
                            image_url=record[3],
                            description=record[4],
                            location=record[5],
                            hosted_by=record[6]
                        )
                        result.append(event)
                    return result
        except Exception as e:
            print(e)
            return {"message": "Could not get events"}
    
    pass

    
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
