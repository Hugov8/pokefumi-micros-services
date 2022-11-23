import express from "express";
import {getAllPokemon} from "./controller";

export const register = (app: express.Application) => {

    app.get("/pokemons", async (req, res) => {
        res.send(await getAllPokemon());
    })
}