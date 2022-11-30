import * as express from "express";
import * as controller from "./controller";
import * as jwt from "./jwt";
import {addPokemon} from "./controller";

export const register = (app: express.Application) => {
    app.get('/', (req,res) => res.send('<h1>Player service</h1>'));

    app.get('/player', (req: any, res) => {
        let token = req.get("token");
        let datas = jwt.decode(token);
        const player = controller.getPlayer(datas.id);
        if(player != undefined) {
            return res.status(200).send(player);
        } else {
            return res.sendStatus(404);
        }
    })

    //TODO: Supprimer (pour debug)
    app.get('/allPlayer', (req, res) => {
        res.send(controller.allPlayer())
    })

    app.post('/player', (req: any, res)=>{
        let userId = req.body.id
        res.status(200).send(controller.addPlayer(userId))
    })

    app.put('/player', (req: any, res) => {
        let datas = jwt.decode(req.get("token"));
        let userId = datas.id;
        let data = req.body.data;
        res.status(201).send(controller.modifyPlayer(userId, data));
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