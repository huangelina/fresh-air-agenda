from pydantic import BaseModel
from typing import Optional

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
