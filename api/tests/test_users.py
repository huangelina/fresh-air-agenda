
from fastapi.testclient import TestClient
from main import app
from queries.users import UserQueries, UserIn, UserOut
from authenticator import authenticator


client = TestClient(app)


class EmptyUserQueries:
    def get_all(self):
        return []

    def get_user_by_id(self, id: int) -> UserOut:
        return UserOut(
            id=1,
            first="string",
            last="string",
            username="string",
            email="string",
            location="string",
            goal=0,
            avatar_picture="string",
            bio="string")

    def update(self,
               id: int,
               user: UserIn,
               hashed_password: str) -> UserOut:
        return UserOut(
            id=1,
            first="string",
            last="string",
            username="string",
            email="string",
            location="string",
            goal=0,
            avatar_picture="string",
            bio="string"
        )


def fake_get_current_account_data():
    return (
        {
                "id": 1,
                "first": "string",
                "last": "string",
                "username": "string",
                "email": "string",
                "location": "string",
                "goal": 0,
                "bio": "string"
        }
    )


def fake_hash_password():
    return {
         "string"
    }


def test_get_all_users():
    app.dependency_overrides[UserQueries] = EmptyUserQueries
    app.dependency_overrides[authenticator.get_current_account_data
                             ] = fake_get_current_account_data
    response = client.get("/users")
    app.dependency_overides = {}
    assert response.status_code == 200
    assert response.json() == []


def test_get_one_user():

    app.dependency_overrides[authenticator.get_current_account_data
                             ] = fake_get_current_account_data
    app.dependency_overrides[UserQueries] = EmptyUserQueries
    response = client.get("/users/1")
    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "first": "string",
        "last": "string",
        "username": "string",
        "email": "string",
        "location": "string",
        "goal": 0,
        "avatar_picture": "string",
        "bio": "string"
    }


def test_update_user():
    id = 1
    app.dependency_overrides[UserQueries] = EmptyUserQueries
    app.dependency_overrides[authenticator.get_current_account_data
                             ] = fake_get_current_account_data

    response = client.put(
        f"users/{id}",
        json={
            "id": 1,
            "first": "string",
            "last": "string",
            "username": "string",
            "password": "string",
            "email": "string",
            "location": "string",
            "goal": 0,
            "avatar_picture": "string",
            "bio": "string"
        }
    )

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "first": "string",
        "last": "string",
        "username": "string",
        "email": "string",
        "location": "string",
        "goal": 0,
        "avatar_picture": "string",
        "bio": "string"
    }
