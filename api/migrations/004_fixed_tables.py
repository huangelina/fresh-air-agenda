steps = [
    [
        """
        CREATE TABLE attendance (
            user_id INT REFERENCES users("id"),
            event_id INT REFERENCES events("id")
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
            user_id INT REFERENCES users("id")
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE timelogs;
        """,

    ],
]
