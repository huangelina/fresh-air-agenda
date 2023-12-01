
from fastapi.testclient import TestClient
from main import app
from queries.users import UserQueries


client = TestClient(app)


class EmptyUserQueries:
    def get_all(self):
        return []


def test_get_all_users():
    app.dependency_overrides[UserQueries] = EmptyUserQueries
    response = client.get("/users")
    app.dependency_overides = {}
    assert response.status_code == 200
    assert response.json() == []
