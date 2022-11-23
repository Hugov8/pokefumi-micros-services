import * as express from "express";
import * as controller from "./controller";
import * as jwt from "./jwt";

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

}