from fastapi import APIRouter, Depends, Response
from typing import List, Optional, Union
from queries.users import UserIn
from queries.users import (
    Error,
    UserIn,
    UserOut,
    UserQueries,
)


router = APIRouter()


@router.post("/users")
def create_user(
    user: UserIn,
    repo: UserQueries = Depends()
):
    return repo.create(user)
