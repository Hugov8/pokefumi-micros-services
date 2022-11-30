import {ParamsDictionary, Query, Request, Response, Send} from "express-serve-static-core"


type ErrorMessage = string
type LoginInfo = {
    login : string,
    password: string
}
type AllUsers = {
    id: number | bigint
    login: string
    password: string
} []

type UserInfo = string

export interface ApiResponse<ResBody> extends Response {
    json: Send<{data: ResBody} | {message: string}, this>
}

export interface ApiResponseToken extends Response {
    json: Send<{token: string} | {message: string}, this>
}

export interface ApiRequest<ReqParams extends ParamsDictionary, ReqQuery extends Query, ReqBody> extends Request {
    params: ReqParams,
    query: ReqQuery,
    body: ReqBody
}

export {LoginInfo, ErrorMessage, AllUsers, UserInfo}