from fastapi import APIRouter,Depends
from queries.timelogs import TimeLogIn,TimeLogRepository,TimeLogOut
from authenticator import authenticator

router = APIRouter()

@router.post('/users/{user_id}/logs/', response_model= TimeLogOut)
def create_timelog(
    timelog: TimeLogIn,
    user_id: int,
    repo: TimeLogRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    return repo.create(timelog)


@router.put('/users/{user_id}/logs/{id}', response_model= TimeLogOut)
def update_timelog(
    id: int,
    user_id: int,
    timelog: TimeLogIn,
    repo: TimeLogRepository = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
) -> TimeLogOut:
    return repo.update(id, user_id, timelog)
