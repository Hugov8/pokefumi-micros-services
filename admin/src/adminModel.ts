import {ParamsDictionary, Query, Request, Response, Send} from "express-serve-static-core"

export interface ApiResponse<ResBody> extends Response {
    json: Send<{data: ResBody} | {message: string}, this>
}

export interface ApiRequest<ReqParams extends ParamsDictionary, ReqQuery extends Query, ReqBody> extends Request {
    params: ReqParams,
    query: ReqQuery,
    body: ReqBody
}

type Admin = "Admin"
type Reporter = "Reporter"

export type Login = string
export type Token = string
export type Role = Admin | Reporter

export type LoginInfo = {
    token: Token,
    login: Login,
    role: Role
}