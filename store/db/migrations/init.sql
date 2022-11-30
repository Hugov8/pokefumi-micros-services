CREATE TABLE IF NOT EXISTS POKEMON (
  pokemon_id INTEGER primary key,
  price integer
);

INSERT or REPLACE INTO POKEMON(pokemon_id, price)
VALUES (1, 23), (4,25), (7, 24);