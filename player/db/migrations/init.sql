CREATE TABLE IF NOT EXISTS player (
    user_id INTEGER PRIMARY KEY,
    credits INTEGER,
    username TEXT
);

CREATE TABLE IF NOT EXISTS team (
    user_id INTEGER PRIMARY KEY,
    pokemon1 INTEGER,
    pokemon2 INTEGER,
    pokemon3 INTEGER,
    pokemon4 INTEGER,
    pokemon5 INTEGER,
    pokemon6 INTEGER,
    FOREIGN KEY (user_id) REFERENCES player(user_id)
);