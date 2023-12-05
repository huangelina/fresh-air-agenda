from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Union
from queries.attendance import (
    AttendanceIn,
    AttendanceOut,
    AttendanceQueries,
    Error
)


class HttpError(BaseModel):
    detail: str


router = APIRouter()


@router.post("/attendance", response_model=AttendanceOut | HttpError)
async def create_attendance(
    info: AttendanceIn,
    repo: AttendanceQueries = Depends(),
):
    return repo.create(info)


@router.get("/attendance", response_model=Union[Error, List[AttendanceOut]])
def get_attendances(
    repo: AttendanceQueries = Depends(),
):
    return repo.get_all()


@router.delete("/attendance/{id}", response_model=bool)
def delete_attendance(
    id: int,
    repo: AttendanceQueries = Depends(),
) -> bool:
    return repo.delete(id)


@router.delete("/events/{id}/attendance", response_model=bool)
def delete_attendance_event(
    id: int,
    repo: AttendanceQueries = Depends(),
) -> bool:
    return repo.delete_event_attendance(id)
