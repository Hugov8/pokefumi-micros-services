import * as express from "express";
import { LoginInfo, ApiRequest, ApiResponse, AllUsers } from "./authModel";
import AuthRepository from "./authRepository";
import * as jwt from "jsonwebtoken"

const authRepo = new AuthRepository()
const privateKey = "1234"

export const register = (app: express.Application) => {
    app.get('/', (req: ApiRequest<any, any, any>,
        res: ApiResponse<any>) => res.send('<h1>Hello World</h1>'));

    app.get('/login', (req, res) => {

        const logUser: LoginInfo = req.body
        if(logUser==undefined){
            return res.status(400).json({message: "Please provide your log in the body"})
        }
        if (authRepo.getLoginInfo(logUser)==undefined){
            return res.status(400).json({message: "Please verify your login/password"})
        }

        
        let token = jwt.sign(logUser, privateKey)
        
        return res.status(200).json({token: token})

    });
    
    app.post('/register', (req: ApiRequest<any, any, LoginInfo>, 
        res: ApiResponse<number|bigint>) => {
        const logUser: LoginInfo = req.body
        console.log(req.body)
        if(logUser==undefined){
            return res.status(400).json({message: "Please provide a login and password in the body request"})
        }
        if(authRepo.getUser(logUser.login)!= undefined){
            return res.status(400).json({message: "Login already used"})
        }
        console.log(logUser)
        const inscrit = authRepo.registerPlayer(logUser)
        return res.status(201).json({data: inscrit})

    });

    app.get('/usersLogin', (req: ApiRequest<any, any, any>, 
        res: ApiResponse<AllUsers>) => {
        if (req.headers.token == undefined){
            return res.status(401).json({message : "Token missing, please authentificate as an admin"})
        }
        //
        // Check if the token correspond to an admin
        // TODO
        // Attendre implémentation des tokens admin

        const infos = authRepo.getAllUsers()
        return res.status(200).json({data: infos})
    });

    // Using only for tests purpose
    // To delete
    app.get('/testToken/:token', (req: ApiRequest<{token: string},any, any>,
        res: ApiResponse<LoginInfo> )=>{
            const info: LoginInfo = jwt.verify(req.params.token, privateKey) as LoginInfo
            console.log(jwt.verify(req.params.token, privateKey))
            return res.status(200).json({data: info})
        })

}