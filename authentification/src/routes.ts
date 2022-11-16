import * as express from "express";

export const register = (app: express.Application) => {
    app.get('/', (req,res) => res.send('<h1>Hello World</h1>'));

    app.get('/login', (req, res) => {});
    
    app.get('/register', (req, res) => {});

    app.get('/usersLogin', (req, res) => {});
}