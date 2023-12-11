from fastapi.testclient import TestClient
from main import app
from authenticator import authenticator
from queries.users import UserOutWithPassword
from queries.timelogs import TimeLogRepository

client = TestClient(app)


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
