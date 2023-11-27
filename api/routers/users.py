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
    hashed_password = authenticator.hash_password(info.password)
    user = repo.create(info, hashed_password)
    form = UserForm(username=info.username, password=info.password)
    token = await authenticator.login(response, request, form, repo)
    return UserToken(user=user, **token.dict())


@router.get("/users", response_model=Union[List[UserOut], Error])
def get_all_users(
    repo: UserQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    return repo.get_all()


@router.put("/users/{user_id}", response_model=Union[UserOut, Error])
def update_user(
    user_id: int,
    user: UserIn,
    repo: UserQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
) -> Union[Error, UserOut]:
    return repo.update(user_id, user)


@router.delete("/users/{user_id}", response_model=bool)
def delete_user(
    user_id: int,
    repo: UserQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
) -> bool:
    return repo.delete(user_id)


@router.get("/users/{user_id}", response_model=Optional[UserOut])
def get_one_user(
    user_id: int,
    repo: UserQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
) -> UserOut:
    user = repo.get_user_by_id(user_id)
    return user
