import * as express from "express";
import { LoginInfo } from "./authModel";
import AuthRepository from "./authRepository";

const authRepo = new AuthRepository()

export const register = (app: express.Application) => {
    app.get('/', (req,res) => res.send('<h1>Hello World</h1>'));

    app.get('/login', (req, res) => {

        const logUser: LoginInfo = req.body
        if(logUser==undefined){
            return res.status(400).json({message: "Please provide your log in the body"})
        }
        if (authRepo.getLoginInfo(logUser)==undefined){
            return res.status(400).json({message: "Please verify your login/password"})
        }

        //
        //Generate token
        // ToDO
        //
        
        return res.status(200).json({token: "success"})

    });
    
    app.get('/register', (req, res) => {});

    app.get('/usersLogin', (req, res) => {
        if (req.headers.token == undefined){
            return res.status(401).json({message : "Token missing, please authentificate as an admin"})
        }
        //
        // Check if the token correspond to an admin
        // TODO
        //

        const infos = authRepo.getAllUsers()
        return res.status(200).json(infos)
    });
}