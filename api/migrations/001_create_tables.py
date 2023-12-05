steps = [
    [

        """
        CREATE TABLE users (
            id SERIAL PRIMARY KEY NOT NULL,
            first VARCHAR(1000) NOT NULL,
            last VARCHAR(1000) NOT NULL,
            username VARCHAR(1000) NOT NULL,
            hashed_password VARCHAR(1000) NOT NULL,
            email VARCHAR(1000) NOT NULL,
            location VARCHAR(1000) NOT NULL,
            goal SMALLINT DEFAULT 0,
            avatar_picture VARCHAR(1000) DEFAULT 'https://merriam-webster.com/assets/mw/images/article/art-wap-article-main/egg-3442-e1f6463624338504cd021bf23aef8441@1x.jpg',
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
            date DATE NOT NULL,
            time TIME NOT NULL,
            image_url VARCHAR(1000),
            description VARCHAR(1000),
            location VARCHAR(1000) NOT NULL,
            created_by INT REFERENCES users("id"),
            hosted_by VARCHAR(1000) NOT NULL
        );
        """,

        """
        DROP TABLE events;
        """
    ],

    [ 
        """
        CREATE TABLE attendance (
            id SERIAL PRIMARY KEY NOT NULL,
            user_id INT REFERENCES users("id"),
            event_id INT REFERENCES events("id"),
            user_name VARCHAR(1000)
        );
        """,

        """
        DROP TABLE attendance;
        """

    ],

    [
        """
        CREATE TABLE timelogs (
            id SERIAL PRIMARY KEY NOT NULL,
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
