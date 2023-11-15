steps = [
    [
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
        """
    ]
]
