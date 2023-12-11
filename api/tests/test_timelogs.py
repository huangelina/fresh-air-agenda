from fastapi.testclient import TestClient
from main import app
from queries.timelogs import TimeLogRepository
from authenticator import authenticator
from queries.users import UserOutWithPassword


client = TestClient(app)


class GetAllTimelogQueries:
    def get_timelogs_for_user(self, user_id: int):
        return [
            {
                "id": 1,
                "date": "2024-01-25",
                "goal": 0,
                "time_outside": 2,
                "user_id": user_id
            },
            {
                "id": 2,
                "date": "2024-01-26",
                "goal": 0,
                "time_outside": 6,
                "user_id": user_id
            }
        ]


class CreateTimelogQueries:
    def create(self, timelog):
        result = {
                "id": 3,
                "date": "2024-01-27",
                "goal": 0,
                "time_outside": 8,
                "user_id": 1
            }

        result.update(timelog.dict())
        return result


class MockTimeLogRepository:
    def get_timelogs_for_user(self, user_id):
        return [
            {
                "id": 1,
                "date": "2023-01-01",
                "goal": 180,
                "time_outside": 60,
                "user_id": 1
            }
        ]


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


def test_get_user_timelogs():
    app.dependency_overrides[TimeLogRepository] = GetAllTimelogQueries
    app.dependency_overrides[authenticator.get_current_account_data
                             ] = fake_get_current_account_data
    response = client.get("/users/1/logs")
    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 1,
            "date": "2024-01-25",
            "goal": 0,
            "time_outside": 2,
            "user_id": 1
        },
        {
            "id": 2,
            "date": "2024-01-26",
            "goal": 0,
            "time_outside": 6,
            "user_id": 1
        }
    ]


def test_create_user_timelog():
    app.dependency_overrides[TimeLogRepository] = CreateTimelogQueries
    app.dependency_overrides[authenticator.get_current_account_data
                             ] = fake_get_current_account_data
    json = {
        "date": "2024-01-27",
        "goal": 0,
        "time_outside": 8,
        "user_id": 1
    }
    expected = {
        "id": 3,
        "date": "2024-01-27",
        "goal": 0,
        "time_outside": 8,
        "user_id": 1
    }
    response = client.post("/users/1/logs/", json=json)
    app.dependency_overrides = {}
    assert response.status_code == 200
    assert response.json() == expected


def mock_get_current_account_data():
    return UserOutWithPassword(
        id=1,
        first="first",
        last="last",
        username="flast",
        hashed_password="qwerty123",
        email="myemail@email.com",
        location="my house",
        goal=180,
        avatar_picture="my_picture.jpeg",
        bio="I am me"
    )


def test_get_timelogs():
    user_id = 1

    app.dependency_overrides[TimeLogRepository] = MockTimeLogRepository
    app.dependency_overrides[authenticator.get_current_account_data
                             ] = mock_get_current_account_data

    response = client.get(f"/users/{user_id}/logs")

    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == [
            {
                "id": 1,
                "date": "2023-01-01",
                "goal": 180,
                "time_outside": 60,
                "user_id": 1
            }
        ]
