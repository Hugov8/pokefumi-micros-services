import * as express from "express";
import * as controller from "./controller";
import * as jwt from "./jwt";
import {addPokemon} from "./controller";

export const register = (app: express.Application) => {
    app.get('/', (req,res) => res.send('<h1>Player service</h1>'));

    app.get('/player', (req: any, res) => {
        let datas = jwt.decode(req.get("token"));
        res.status(200).send(controller.getPlayer(req.params.playerId))
    })

    app.put('/player', (req: any, res) => {
        // let datas = jwt.decode(req.get("token"));
        let userId = req.body.id;
        let data = req.body.data;
        res.send(controller.modifyPlayer(userId, data));
    })

    app.post('/player/:player_id/buy_pokemon', (req, res) => {
        const pokemon = req.body.pokemon;
        const player_id = parseInt(req.params.player_id);
        const result = addPokemon(player_id, pokemon);
        if(result == null) {
            return res.sendStatus(400);
        }
        return res.status(200).send(result);

    })

}