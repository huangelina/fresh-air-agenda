steps = [
    [
        # "Up" SQL statement
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
        # "Down" SQL statement
        """
        DROP TABLE events;
        """,

        """
        CREATE TABLE attendance (
            FOREIGN KEY (user_id) REFERENCES users("id"),
            FOREIGN KEY (event_id) REFERENCES events("id"),
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE attendance;
        """,

        """
        CREATE TABLE timelogs (
            date DATE NOT NULL,
            goal INT NOT NULL,
            time_outside INT DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users("id")
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE timelogs;
        """,

    ],
]
