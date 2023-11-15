from fastapi import APIRouter


router = APIRouter()


@router.post("/users")
def create_user():
    pass
