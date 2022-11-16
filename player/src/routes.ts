import * as express from "express";
import * as controller from "./controller";

export const register = (app: express.Application) => {
    app.get('/', (req,res) => res.send('<h1>Player service</h1>'));

    app.get('/player', (req: any, res) => {
        res.send(controller.getPlayer(req.params.playerId))
    })

}