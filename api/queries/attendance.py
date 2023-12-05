from pydantic import BaseModel
from typing import Union, List
from queries.pool import pool


class Error(BaseModel):
    message: str


class AttendanceIn(BaseModel):
    user_id: int
    event_id: int
    user_name: str


class AttendanceOut(BaseModel):
    id: int
    user_id: int
    event_id: int
    user_name: str


class AttendanceQueries:
    def get_all(self) -> Union[Error, List[AttendanceOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT
                        id,
                        user_id,
                        event_id,
                        user_name
                        FROM attendance
                        """
                    )
                    return [
                        self.record_to_attendance_out(record)
                        for record in result
                    ]
        except Exception:
            return {"message": "Could not get attendees"}

    def create(self, attendance: AttendanceIn) -> AttendanceOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO attendance
                            (user_id, event_id, user_name)
                        VALUES
                            (%s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            attendance.user_id,
                            attendance.event_id,
                            attendance.user_name
                        ]
                    )
                    id = result.fetchone()[0]
                    return self.attendance_in_to_out(id, attendance)
        except Exception:
            return {"message": "Create did not work"}

    def delete(self, id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE from attendance
                        WHERE id = %s
                        """,
                        [id]
                    )
                    print(id)
                    return True
        except Exception:
            return False

    def delete_event_attendance(self, id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE from attendance
                        WHERE event_id = %s
                        """,
                        [id]
                    )
                    print(id)
                    return True
        except Exception:
            return False

    def attendance_in_to_out(self, id: int, attendance: AttendanceIn):
        old_data = attendance.dict()
        return AttendanceOut(id=id, **old_data)

    def record_to_attendance_out(self, record):
        return AttendanceOut(
            id=record[0],
            user_id=record[1],
            event_id=record[2],
            user_name=record[3]
        )
