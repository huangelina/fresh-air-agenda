from pydantic import BaseModel
from typing import Optional, Union
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
                        [username],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_user_out(record)
        except Exception:
            return {"message": "Could not get account"}

    pass

    # def get_one(self, vacation_id: int) -> Optional[VacationOut]:
    #     try:
    #         # connect the database
    #         with pool.connection() as conn:
    #             # get a cursor (something to run SQL with)
    #             with conn.cursor() as db:
    #                 # Run our SELECT statement
    #                 result = db.execute(
    #                     """
    #                     SELECT id
    #                          , name
    #                          , from_date
    #                          , to_date
    #                          , thoughts
    #                     FROM vacations
    #                     WHERE id = %s
    #                     """,
    #                     [vacation_id]
    #                 )
    #                 record = result.fetchone()
    #                 if record is None:
    #                     return None
    #                 return self.record_to_vacation_out(record)
    #     except Exception as e:
    #         print(e)
    #         return {"message": "Could not get that vacation"}

    # def delete(self, vacation_id: int) -> bool:
    #     try:
    #         # connect the database
    #         with pool.connection() as conn:
    #             # get a cursor (something to run SQL with)
    #             with conn.cursor() as db:
    #                 db.execute(
    #                     """
    #                     DELETE FROM vacations
    #                     WHERE id = %s
    #                     """,
    #                     [vacation_id]
    #                 )
    #                 return True
    #     except Exception as e:
    #         print(e)
    #         return False

    # def update(self, vacation_id: int, vacation: VacationIn) -> Union[VacationOut, Error]:
    #     try:
    #         # connect the database
    #         with pool.connection() as conn:
    #             # get a cursor (something to run SQL with)
    #             with conn.cursor() as db:
    #                 db.execute(
    #                     """
    #                     UPDATE vacations
    #                     SET name = %s
    #                       , from_date = %s
    #                       , to_date = %s
    #                       , thoughts = %s
    #                     WHERE id = %s
    #                     """,
    #                     [
    #                         vacation.name,
    #                         vacation.from_date,
    #                         vacation.to_date,
    #                         vacation.thoughts,
    #                         vacation_id
    #                     ]
    #                 )
    #                 # old_data = vacation.dict()
    #                 # return VacationOut(id=vacation_id, **old_data)
    #                 return self.vacation_in_to_out(vacation_id, vacation)
    #     except Exception as e:
    #         print(e)
    #         return {"message": "Could not update that vacation"}

    # def get_all(self) -> Union[Error, List[VacationOut]]:
    #     try:
    #         # connect the database
    #         with pool.connection() as conn:
    #             # get a cursor (something to run SQL with)
    #             with conn.cursor() as db:
    #                 # Run our SELECT statement
    #                 result = db.execute(
    #                     """
    #                     SELECT id, name, from_date, to_date, thoughts
    #                     FROM vacations
    #                     ORDER BY from_date;
    #                     """
    #                 )
    #                 # result = []
    #                 # for record in db:
    #                 #     vacation = VacationOut(
    #                 #         id=record[0],
    #                 #         name=record[1],
    #                 #         from_date=record[2],
    #                 #         to_date=record[3],
    #                 #         thoughts=record[4],
    #                 #     )
    #                 #     result.append(vacation)
    #                 # return result

    #                 return [
    #                     self.record_to_vacation_out(record)
    #                     for record in result
    #                 ]
    #     except Exception as e:
    #         print(e)
    #         return {"message": "Could not get all vacations"}

    def create(self, user: UserIn,
               hashed_password: str) -> UserOutWithPassword:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor (something to run SQL with)
                with conn.cursor() as db:
                    # Run our INSERT statement
                    result = db.execute(
                        """
                        INSERT INTO users
                            (first, last, username, hashed_password, email, location, goal, avatar_picture, bio)
                        VALUES
                            (%s, %s, %s, %s, %s, %s, %s, %s, %s)
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
                            user.avatar_picture,
                            user.bio
                        ]
                    )
                    id = result.fetchone()[0]
                    # Return new data
                    # old_data = vacation.dict()
                    # return VacationOut(id=id, **old_data)
                    return self.user_in_to_out(id, user)
        except Exception:
            return {"message": "Create did not work"}

    def user_in_to_out(self, id: int, user: UserIn):
        old_data = user.dict()
        return UserOut(id=id, **old_data)

    def record_to_user_out(self, record):
        return UserOutWithPassword(
            first=record[0],
            last=record[1],
            username=record[2],
            hashed_password=record[3],
            email=record[4],
            location=record[5],
            goal=record[6],
            avatar_picture=record[7],
            bio=record[8]
        )
