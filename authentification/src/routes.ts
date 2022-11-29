import * as express from "express";
import { LoginInfo, ApiRequest, ApiResponse, ApiResponseToken, AllUsers } from "./authModel";
import AuthRepository from "./authRepository";
import axios from "axios"
import * as jwt from "jsonwebtoken"

const authRepo = new AuthRepository()
const privateKey = "1234"

export const register = (app: express.Application) => {
    app.get('/', (req: ApiRequest<any, any, any>,
        res: ApiResponse<any>) => res.send('<h1>Hello World</h1>'));

    app.get('/login', (req: ApiRequest<any, any, LoginInfo>,
        res: ApiResponseToken) => {

        const logUser: LoginInfo = req.body
        if(logUser==undefined){
            return res.status(400).json({message: "Please provide your log in the body"})
        }
        const id = authRepo.getLoginInfo(logUser)
        if (id==undefined){
            return res.status(400).json({message: "Please verify your login/password"})
        }

        
        let token = jwt.sign(id, privateKey)
        
        return res.status(200).json({token: token})

    });
    
    app.post('/register', async (req: ApiRequest<any, any, LoginInfo>, 
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
        const playerRes = await axios.post<{ data: string }>(`http://player:5000/player`, {id: inscrit}).then((http_res) => {
            if (http_res.status == 200) {
                return http_res;
            }
        }).catch((err) => {
            console.log(err.data);
            return undefined;
        })
        
        return res.status(201).json({data: inscrit})

    });

    app.get('/usersLogin', async (req: ApiRequest<any, any, any>, 
        res: ApiResponse<AllUsers>) => {
        if (req.headers.token == undefined){
            return res.status(401).json({message : "Token missing, please authentificate as an admin"})
        }

        const adminToken = req.headers.token
        const role = await axios.get<{ data: string }>(`http://role:5002/getRole/`+adminToken).then((http_res) => {
            if (http_res.status == 200) {
                return http_res.data.data;
            }
        }).catch((err) => {
            console.log(err.data);
            return undefined;
        })
        if(role != "Admin"){
            return res.status(401).json({message: "Admin token incorrect"})
        }

        const infos = authRepo.getAllUsers()
        return res.status(200).json({data: infos})
    });

    // Using only for tests purpose
    // To delete
    app.get('/testToken/:token', (req: ApiRequest<{token: string},any, any>,
        res: ApiResponse<any> )=>{
            const info = jwt.verify(req.params.token, privateKey)
            console.log(jwt.verify(req.params.token, privateKey))
            return res.status(200).json({data: info})
        })

}