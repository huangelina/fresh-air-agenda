from fastapi import APIRouter, Depends
from authenticator import authenticator
from pydantic import BaseModel
from typing import List, Union
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
):
    return repo.get_events()