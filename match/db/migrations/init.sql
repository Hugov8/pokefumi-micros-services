CREATE TABLE IF NOT EXISTS match (
    id INTEGER PRIMARY KEY,
    round1 INTEGER,
    round2 INTEGER,
    round3 INTEGER,
    current_round INTEGER,
    joueur1 INTEGER,
    joueur2 INTEGER,
    winner INTEGER,
    open BOOLEAN,
    status INTEGER
);

CREATE TABLE IF NOT EXISTS round (
    id INTEGER PRIMARY KEY,
    match_id INTEGER,
    pokemon_j1 INTEGER,
    pokemon_j2 INTEGER,
    status INTEGER,
    winner INTEGER,
    FOREIGN KEY (match_id) REFERENCES match(id)
);