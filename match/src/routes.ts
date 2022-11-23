import * as express from "express";


export const register = (app: express.Application) => {
    app.get('/', (req, res) => res.send('<h1>Hello World</h1>'));


    app.post('/createMatch', (req, res) => res.send('<h1>Create Match</h1>'))
    app.get('/openMatch', (req, res)=> res.send('Liste des matchs ouverts'))
    app.post('/joinMatch', (req, res)=>res.send('Join a match'))
    app.get('/match/:id', (req, res)=>res.send('Détail d\'un match'))
    app.post('/match/:id/nextRound', (req, res)=>res.send('Joue le prochain round'))
    app.get('/match/:id/current_round', (req, res)=>res.send('Infos dur le round en cours'))
}