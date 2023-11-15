
### Create User

* Endpoint path: /users
* Endpoint method: POST

* Request shape (form):
  * username: string
  * password: string
  * email: string
  * location: string

* Response: User creation and token
* Response shape (JSON):
    ```json
    {
      "account": {
        username: string,
        password: string,
        email: string,
        location: string,
        avatar_url: url,
      },
    }
    ```


### Log in

* Endpoint path: /token
* Endpoint method: POST

* Request shape (form):
  * username: string
  * password: string


* Response: Account information and a token
* Response shape (JSON):
    ```json
    {
      "token": string
    }
    ```

### Log out

* Endpoint path: /token
* Endpoint method: DELETE

* Headers:
  * Authorization: Bearer token

* Response: Always true
* Response shape (JSON):
    ```json
    true
    ```


### Event Data

* Endpoint path: /events
* Endpoint method: GET

* Headers:
  * Authorization: Bearer token

* Request shape (JSON):
    ```json
    {
      "user_id": "X",
      "location" : "string"
    }
    ```

* Response: List of events user is in
* Response shape (JSON):
    ```json
    {
      "events" :[
        {
          "event_id": "string",
          "image_url": "string",
          "event_name": "string",
          "hosted_by" : "user1",
          "location": "string",
          "date" : "date",
          "attendees" : [ user_id1: "string", user_id2: "string"],
          "description": "textfield"

      }
      ]
    }
    ```

### Daily log

* Endpoint path: users/{id}/logs/
* Endpoint method: GET

* Headers:
  * Authorization: Bearer token

* Request shape (JSON):
    ```json
    {
      "todays_date" : "datetime"
    }
    ```
* Response: Getting the TimeLog for that Day
* Response shape (JSON):
  ```json
      {
        "log_id": "string"
      }
    ```
    // return 200 for existing //
    // return 404 if doesn't exist //

### Daily log

* Endpoint path: users/{id}/logs/
* Endpoint method: POST

* Headers:
  * Authorization: Bearer token

* Request shape (JSON):
    ```json
    {
      "date" : "datetime",
      "goal" : "int",
      "time_spent_outside" : 0,
    }
    ```
* Response: Creating the TimeLog for the day
* Response shape (JSON):
  ```json
      {
        "message" : "Created!"
      }
    ```

### Time Change

* Endpoint path: users/{id}/logs/{id}
* Endpoint method: PUT

* Headers:
  * Authorization: Bearer token

* Request shape (JSON):
    ```json
    {
      "time_spent_outside" : 2,
    }
    ```

* Response: Change the value of time spent outside of the Unique Daily Log for the user
* Response shape (JSON):
    ```json
    {
      "message" : "time updated"
    }
    ```

### Log Information

* Endpoint path: users/{id}/logs
* Endpoint method: GET

* Headers:
  * Authorization: Bearer token

* Request shape (JSON):
    ```json
    {
      "start_date" : "day",
      "end_date" : "day+7",
    }
    ```

* Response: Get daily logs tied to user
* Response shape (JSON):
    ```json
    {
      "logs" : [
          {
          "log_id": "string",
          "date" : "datetime",
          "goal" : 20,
          "time_spent_outside" : "4",
          "user_id" : 1
          }
    ]
    }
    ```

### User Data

* Endpoint path: /users/{id}
* Endpoint method: GET

* Headers:
  * Authorization: Bearer token



* Response: Account information
* Response shape (JSON):
    ```json
    {
      "account": {
        username: string,
        email: string,
        location: string,
        avatar_url: url,
        goal: int
        bio : textfield
      },
    }
    ```

### Change User Data

* Endpoint path: /users/{id}
* Endpoint method: PUT

* Headers:
  * Authorization: Bearer token

* Request shape (JSON):
    ```json
    {
      "account": {
        username: string,
        password: string,
        email: string,
        location: string,
        avatar_url: url,
        goal: int
        bio: textfield
      },
    }
    ```

* Response: Change Account information
* Response shape (JSON):
```json
    {
      "message" : "field changed"
    }
    ```



### Delete User Data

* Endpoint path: /users/{id}
* Endpoint method: Delete

* Headers:
  * Authorization: Bearer token

* Response: Delete Account
* Response shape (JSON):
    ```json
    {
      "message": "User deleted"
    }
    ```

### Event detail

* Endpoint path: /events/{id}
* Endpoint method: GET

* Headers:
  * Authorization: Bearer token

* Response: Get details for one event
* Response shape (JSON):
    ```json
    {
      {
        "hosted_by" : User_id,
        "location": "string",
        "date" : "date",
        "attendees" : [user1,user2],
        "description": "textfield",
        "event_id" : "string",
        "event_name": "string"
    }
    },

    ```

### Create Event

* Endpoint path: /events/
* Endpoint method: POST

* Headers:
  * Authorization: Bearer token

* Request shape (JSON):
     ```json
    {
    {
        "hosted_by" : user_id,
        "location": "string",
        "date" : "date",
        "description": "textfield",
        "event_name": "string"
    }
    },

    ```

* Response: Create a new event
* Response shape (JSON):
    ```json
    {
     "message": "event created"
    },

    ```

### Edit Event

* Endpoint path: /events/{id}
* Endpoint method: PUT

* Headers:
  * Authorization: Bearer token

* Request shape (JSON):
     ```json
    {
    {
        "hosted_by" : user_id,
        "location": "string",
        "date" : "date",
        "description": "textfield",
        "event_name": "string"
    }
    },

    ```

* Response: Edit an event
* Response shape (JSON):
    ```json
    {
      "message": "event edited"
    }

    ```

### Delete Event

* Endpoint path: /events/{id}
* Endpoint method: DELETE

* Response: Delete an event
* Response shape (JSON):
    ```json
    {
      "message": "deleted event"
    },

    ```
