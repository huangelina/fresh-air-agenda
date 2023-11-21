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
    def get_one(self, id: int) -> Optional[EventOut]:
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
                        WHERE id = %s
                        """,
                        [id]
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_event_out(record)
        except Exception:
            return {"message": "Could not get that event"}

    def get_all(self) -> Union[Error, List[EventOut]]:
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
                    return [
                        self.record_to_event_out(record)
                        for record in result
                    ]
        except Exception:
            return {"message": "Could not get events"}
    
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
    
    def update(self, id: int, event: EventIn) -> Union[Error, EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        UPDATE events
                        SET name = %s,
                            date = %s, 
                            image_url = %s, 
                            description = %s, 
                            location = %s, 
                            hosted_by = %s
                        WHERE id = %s
                        """,
                        [
                            event.name,
                            event.date,
                            event.image_url,
                            event.description,
                            event.location,
                            event.hosted_by,
                            id
                        ]
                    )
                    return self.user_in_to_out(id, event)
        except Exception as e:
            print(e)
            return {"message": "Could not update event"}


    def delete(self, id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM events
                        WHERE id = %s
                        """,
                        [id]
                    )
                    print(id)
                    return True
        except Exception:
            return False

    def user_in_to_out(self, id: int, event: EventIn):
        old_data = event.dict()
        return EventOut(id=id, **old_data)

    def record_to_event_out(self, record):
        return EventOut(
            id=record[0],
            name=record[1],
            date=record[2],
            image_url=record[3],
            description=record[4],
            location=record[5],
            hosted_by=record[6]
        )
