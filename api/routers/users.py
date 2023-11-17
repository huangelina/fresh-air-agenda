from fastapi import APIRouter, Depends, Response, HTTPException, status, Request
from jwtdown_fastapi.authentication import Token
from authenticator import authenticator
from pydantic import BaseModel
from typing import List, Optional, Union
from queries.users import UserIn
from queries.users import (
    Error,
    UserIn,
    UserOut,
    UserQueries,
)

class UserForm(BaseModel):
    username: str
    password: str

class UserToken(Token):
    user: UserOut

class HttpError(BaseModel):
    detail: str

router = APIRouter()


@router.post("/users", response_model=UserToken | HttpError)
async def create_user(
    info: UserIn,
    request: Request,
    response: Response,
    repo: UserQueries = Depends(),
):
    print(repo)
    hashed_password = authenticator.hash_password(info.password)
    user = repo.create(info, hashed_password)
    form = UserForm(username=info.username, password=info.password)
    token = await authenticator.login(response, request, form, repo)
    return UserToken(user=user, **token.dict())
