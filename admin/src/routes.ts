import * as express from "express";
import { TokenGenerator } from 'ts-token-generator';
import { ApiRequest, ApiResponse, Login, LoginInfo, Role, Token } from "./adminModel";
import AdminRepository from "./adminRepo";

const adminRepo = new AdminRepository()
const tokgen = new TokenGenerator()
const password = "password"

export const register = (app: express.Application) => {
    app.get('/', (req: ApiRequest<any, any, any>,
        res: ApiResponse<any>) => res.send('<h1>Hello World</h1>'));
    
    app.get('/getRole/:idToken', (req: ApiRequest<any, any, any>, 
        rep: ApiResponse<Role>)=> {
            const user: LoginInfo = adminRepo.getUserToken(req.params.idToken)
            if (user== undefined){
                return rep.status(404).json({message: "Token doesn't exist in database"})
            }
            rep.status(200).json({data: user.role})
        })
    app.post('/addToken', (req: ApiRequest<any, any, {login: Login, role: Role}>, 
        res: ApiResponse<Token>) => {
            if (req.headers.password ==undefined){
                return res.status(400).json({message: "Please provide the password"})
            }
            if(req.headers.password != password){
                return res.status(401).json({message: "Wrong password"})
            }
            if (req.body.login==undefined || req.body.role==undefined){
                return res.status(400).json({message:"Provide all arguments"})
            }

            const tokenInfo: LoginInfo= {
                login: req.body.login,
                role: req.body.role,
                token: tokgen.generate()
            }
            
            const id = adminRepo.addToken(tokenInfo)
            return res.status(200).json({data: tokenInfo.token})

        })
    
    app.get('/allToken', (req: ApiRequest<any, any, any>, 
            res: ApiResponse<LoginInfo[]>) => {
                if (req.headers.password ==undefined){
                    return res.status(400).json({message: "Please provide the password"})
                }
                if(req.headers.password != password){
                    return res.status(401).json({message: "Wrong password"})
                }
    
                const id = adminRepo.getAllToken()
                return res.status(200).json({data: id})
    
            })

    app.post('/removeToken/:token', (req: ApiRequest<any, any, any>,
        res: ApiResponse<string>)=>{
            if (req.headers.password ==undefined){
                return res.status(400).json({message: "Please provide the password"})
            }
            if(req.headers.password != password){
                return res.status(401).json({message: "Wrong password"})
            }

            if(adminRepo.getUserToken(req.params.token)==undefined){
                return res.status(404).json({message: "Token doesn't exist"})
            }

            adminRepo.removeToken(req.params.token)
            return res.status(202).json({data: "success"})

        })

    }
