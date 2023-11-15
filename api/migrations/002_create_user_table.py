steps = [
    [
        # "Up" SQL statement
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
        # "Down" SQL statement
        """
        DROP TABLE USERS;
        """
    ],
]
