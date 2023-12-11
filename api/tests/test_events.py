from fastapi.testclient import TestClient
from main import app
from queries.events import EventQueries, EventOut
from authenticator import authenticator


client = TestClient(app)


class GetAllEventQueries:
    def get_all(self):
        return [
            {
                "id": 1,
                "name": "Santa Monica Beach Sunset",
                "date": "2024-01-25",
                "time": "18:00:00",
                "image_url": "image url-1",
                "description": "Come together to watch the sunset",
                "location": "Santa Monica",
                "created_by": 4,
                "hosted_by": "John Smith"
            },
            {
                "id": 2,
                "name": "Dolores Park Picnic",
                "date": "2024-04-15",
                "time": "12:00:00",
                "image_url": "image url-2",
                "description": "Eat food and relax at the Park",
                "location": "San Francisco",
                "created_by": 3,
                "hosted_by": "Ryan Miller"
            }
        ]

    def get_one(self, id: int) -> EventOut:
        return EventOut(
            id=5,
            name="Basketball at the Park",
            date="2024-06-25",
            time="05:03:00",
            image_url="image url-5",
            description="Come shoot some hoops with us",
            location="Sacramento",
            created_by=2,
            hosted_by="Kobe Bryant"
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


def test_get_all_events():
    app.dependency_overrides[EventQueries] = GetAllEventQueries
    app.dependency_overrides[authenticator.get_current_account_data
                             ] = fake_get_current_account_data
    response = client.get("/events")
    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 1,
            "name": "Santa Monica Beach Sunset",
            "date": "2024-01-25",
            "time": "18:00:00",
            "image_url": "image url-1",
            "description": "Come together to watch the sunset",
            "location": "Santa Monica",
            "created_by": 4,
            "hosted_by": "John Smith"
        },
        {
            "id": 2,
            "name": "Dolores Park Picnic",
            "date": "2024-04-15",
            "time": "12:00:00",
            "image_url": "image url-2",
            "description": "Eat food and relax at the Park",
            "location": "San Francisco",
            "created_by": 3,
            "hosted_by": "Ryan Miller"
        }
    ]


def test_get_one_event():
    app.dependency_overrides[EventQueries] = GetAllEventQueries
    app.dependency_overrides[authenticator.get_current_account_data
                             ] = fake_get_current_account_data
    response = client.get("/events/5")
    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == {
        "id": 5,
        "name": "Basketball at the Park",
        "date": "2024-06-25",
        "time": "05:03:00",
        "image_url": "image url-5",
        "description": "Come shoot some hoops with us",
        "location": "Sacramento",
        "created_by": 2,
        "hosted_by": "Kobe Bryant"
    }
