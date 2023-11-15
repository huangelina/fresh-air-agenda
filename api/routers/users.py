from fastapi import APIRouter
from queries.users import UserIn

router = APIRouter()


@router.post("/users")
def create_user(user: UserIn):
    print('user', user)
    return user
