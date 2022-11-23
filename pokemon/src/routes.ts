import express from "express";
import {getPokemon} from "./controller";

export const register = (app: express.Application) => {
    app.get("/pokemon/:id", async (req, res) => {
        const id = parseInt(req.params.id);
        const info = await getPokemon(id);
        console.log(info);
        res.send(info);
    })
}