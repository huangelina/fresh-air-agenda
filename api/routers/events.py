from fastapi import APIRouter, Depends, Response
from authenticator import authenticator
from pydantic import BaseModel
from typing import List, Union, Optional
from queries.events import (
    EventIn,
    EventOut,
    EventQueries,
    Error
)


class HttpError(BaseModel):
    detail: str


router = APIRouter()


@router.post("/events", response_model=EventOut | HttpError)
async def create_event(
    info: EventIn,
    repo: EventQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    return repo.create(info)


@router.get("/events", response_model=Union[Error, List[EventOut]])
def get_events(
    repo: EventQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    return repo.get_all()


@router.get("/events/{id}", response_model=Optional[EventOut])
def get_one_event(
    id: int,
    response: Response,
    repo: EventQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
) -> EventOut:
    event = repo.get_one(id)
    if event is None:
        response.status_code = 404
    return event


@router.put("/events/{id}", response_model=Union[Error, EventOut])
def update_event(
    id: int,
    event: EventIn,
    repo: EventQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
) -> Union[Error, EventOut]:
    return repo.update(id, event)


@router.delete("/events/{id}", response_model=bool)
def delete_event(
    id: int,
    repo: EventQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
) -> bool:
    return repo.delete(id)
