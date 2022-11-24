import express from "express";
import {buyPokemonForPlayer, getAllPokemon, getPokemon} from "./controller";
import * as jwt from "./jwt";
import {Pokemon} from "./models";

export const register = (app: express.Application) => {

    app.get("/pokemons", async (req, res) => {
        res.send(await getAllPokemon());
    })

    app.get("/pokemon/:id", async (req, res) => {
        const id = parseInt(req.params.id);
        res.send(await getPokemon(id));
    })

    app.post("/pokemon/:id/buy", async (req, res) => {
        if (req.headers.token == undefined) {
            return res.sendStatus(400);
        }
        const token = req.headers.token.toString();
        const user: { id: number } = jwt.decode(token);

        const pokemon_id = parseInt(req.params.id);
        const pokemon: Pokemon | {} = await getPokemon(pokemon_id);
        if((<Pokemon>pokemon).pokemon_id == undefined) {
            return res.sendStatus(404);
        }
        const real_pokemon = <Pokemon>pokemon;
        await buyPokemonForPlayer(real_pokemon, user.id);
    })
}