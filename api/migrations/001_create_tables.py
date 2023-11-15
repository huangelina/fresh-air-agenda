steps = [
    [

        """
        CREATE TABLE users (
            id SERIAL PRIMARY KEY NOT NULL,
            first VARCHAR(1000) NOT NULL,
            last VARCHAR(1000) NOT NULL,
            username VARCHAR(1000) NOT NULL,
            password VARCHAR(1000) NOT NULL,
            email VARCHAR(1000) NOT NULL,
            location VARCHAR(1000),
            goal SMALLINT DEFAULT 0,
            avatar_picture VARCHAR(1000),
            bio TEXT
        );
        """,

        """
        DROP TABLE USERS;
        """
    ],

    [
        """
        CREATE TABLE events (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(1000) NOT NULL,
            date TIMESTAMP NOT NULL,
            image_url VARCHAR(1000),
            description VARCHAR(1000) NOT NULL,
            location VARCHAR(1000),
            hosted_by INT REFERENCES users("id")
        );
        """,

        """
        DROP TABLE events;
        """
    ],

    [
        """
        CREATE TABLE attendance (
            user_id INT REFERENCES users("id"),
            event_id INT REFERENCES events("id")
        );
        """,

        """
        DROP TABLE attendance;
        """

    ],

    [
        """
        CREATE TABLE timelogs (
            date DATE NOT NULL,
            goal INT NOT NULL,
            time_outside INT DEFAULT 0,
            user_id INT REFERENCES users("id")
        );
        """,

        """
        DROP TABLE timelogs;
        """
    ]
]
