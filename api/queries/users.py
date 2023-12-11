from pydantic import BaseModel
from typing import Optional, Union, List
from queries.pool import pool


class Error(BaseModel):
    message: str


class UserIn(BaseModel):
    first: str
    last: str
    username: str
    password: str
    email: str
    location: str
    goal: Optional[int]
    avatar_picture: Optional[str]
    bio: Optional[str]


class UserOut(BaseModel):
    id: int
    first: str
    last: str
    username: str
    email: str
    location: str
    goal: Optional[int]
    avatar_picture: Optional[str]
    bio: Optional[str]


class UserOutWithPassword(UserOut):
    hashed_password: str


class UserQueries:
    def get(self, username: str) -> UserOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT
                        id,
                        first,
                        last,
                        username,
                        hashed_password,
                        email,
                        location,
                        goal,
                        avatar_picture,
                        bio
                        FROM users
                        WHERE username = %s
                        """,
                        [username]
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_user_out(record)
        except Exception:
            return {"message": "Could not get account"}

    def get_user_by_id(self, user_id: int) -> UserOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                        """
                        SELECT
                        id,
                        first,
                        last,
                        username,
                        email,
                        location,
                        goal,
                        avatar_picture,
                        bio
                        FROM users
                        WHERE id = %s
                        """,
                        [user_id]
                    )
                record = result.fetchone()
                if record is None:
                    return None
                return UserOut(
                    id=record[0],
                    first=record[1],
                    last=record[2],
                    username=record[3],
                    email=record[4],
                    location=record[5],
                    goal=record[6],
                    avatar_picture=record[7],
                    bio=record[8]
                )

    def delete(self, user_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        DELETE FROM users
                        WHERE id = %s
                        """,
                        [user_id]
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def update(self,
               user_id: int,
               user: UserIn,
               hashed_password: str) -> Union[UserOutWithPassword, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        UPDATE users
                        SET
                            first = %s,
                            last = %s,
                            username = %s,
                            hashed_password = %s,
                            email = %s,
                            location = %s,
                            goal = %s,
                            avatar_picture = %s,
                            bio = %s
                        WHERE id = %s
                        """,
                        [
                            user.first,
                            user.last,
                            user.username,
                            hashed_password,
                            user.email,
                            user.location,
                            user.goal,
                            user.avatar_picture,
                            user.bio,
                            user_id
                        ]
                    )
                    return self.user_in_to_out(user_id, user)
        except Exception as e:
            print(e)
            return {"message": "Could not update that user"}

    def get_all(self) -> Union[Error, List[UserOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT
                        id,
                        first,
                        last,
                        username,
                        email,
                        location,
                        goal,
                        avatar_picture,
                        bio
                        FROM users
                        """
                    )
                    output = []
                    for record in db:
                        user = UserOut(
                            id=record[0],
                            first=record[1],
                            last=record[2],
                            username=record[3],
                            email=record[4],
                            location=record[5],
                            goal=record[6],
                            avatar_picture=record[7],
                            bio=record[8]
                        )
                        output.append(user)
                    return output
        except Exception as e:
            print(e)
            return {"message": "Could not get all vacations"}

    def create(self, user: UserIn,
               hashed_password: str) -> UserOutWithPassword:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO users (
                            first,
                            last,
                            username,
                            hashed_password,
                            email,
                            location,
                            goal,
                            bio
                        )
                        VALUES
                            (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            user.first,
                            user.last,
                            user.username,
                            hashed_password,
                            user.email,
                            user.location,
                            user.goal,
                            user.bio
                        ]
                    )
                    id = result.fetchone()[0]
                    return self.user_in_to_out(id, user)
        except Exception:
            return {"message": "Create did not work"}

    def user_in_to_out(self, id: int, user: UserIn):
        old_data = user.dict()
        return UserOut(id=id, **old_data)

    def record_to_user_out(self, record):
        return UserOutWithPassword(
            id=record[0],
            first=record[1],
            last=record[2],
            username=record[3],
            hashed_password=record[4],
            email=record[5],
            location=record[6],
            goal=record[7],
            avatar_picture=record[8],
            bio=record[9]
        )
