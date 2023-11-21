from fastapi import APIRouter, Depends
from authenticator import authenticator
from pydantic import BaseModel
from queries.events import (
    EventIn,
    EventOut,
    EventQueries,
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
    repo.create(info)
    return EventOut(
        name=info.name,
        date=info.date,
        image_url=info.image_url,
        description=info.description,
        location=info.location,
        hosted_by=info.hosted_by
    )
