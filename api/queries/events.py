from pydantic import BaseModel
from typing import Optional, Union, List
from datetime import date, time
from queries.pool import pool


class Error(BaseModel):
    message: str


class EventIn(BaseModel):
    name: str
    date: date
    time: time
    image_url: Optional[str]
    description: str
    location: str
    created_by: int
    hosted_by: str


class EventOut(BaseModel):
    id: int
    name: str
    date: date
    time: time
    image_url: Optional[str]
    description: str
    location: str
    created_by: int
    hosted_by: str


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
                        time,
                        image_url,
                        description,
                        location,
                        created_by,
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
                        time,
                        image_url,
                        description,
                        location,
                        created_by,
                        hosted_by
                        FROM events
                        ORDER BY date ASC, time ASC
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
                            (
                                name,
                                date,
                                time,
                                image_url,
                                description,
                                location,
                                created_by,
                                hosted_by
                            )
                        VALUES
                            (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            event.name,
                            event.date,
                            event.time,
                            event.image_url,
                            event.description,
                            event.location,
                            event.created_by,
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
                    db.execute(
                        """
                        UPDATE events
                        SET name = %s,
                            date = %s,
                            time = %s,
                            image_url = %s,
                            description = %s,
                            location = %s,
                            created_by = %s,
                            hosted_by = %s
                        WHERE id = %s
                        """,
                        [
                            event.name,
                            event.date,
                            event.time,
                            event.image_url,
                            event.description,
                            event.location,
                            event.created_by,
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
            time=record[3],
            image_url=record[4],
            description=record[5],
            location=record[6],
            created_by=record[7],
            hosted_by=record[8]
        )
