import {ParamsDictionary, Query, Request, Response, Send} from "express-serve-static-core"


export interface ApiResponse<ResBody> extends Response {
    json: Send<{data: ResBody} | {message: string}, this>
}

export type ID = number | bigint
export enum Status {
    PREPARATION = 0,
    IN_PROGRESS = 1,
    FINISHED = -1

}

export type MatchData = {
    id: ID,
    round1: ID,
    round2: ID,
    round3: ID,
    current_round: number,
    joueur1: ID,
    joueur2: ID,
    winner: ID,
    open: boolean,
    status: Status
}

export type RoundData = {
    id: ID,
    match_id: ID,
    pokemon_j1: ID,
    pokemon_j2: ID,
    status: Status,
    winner: ID
}

export interface ApiRequest<ReqParams extends ParamsDictionary, ReqQuery extends Query, ReqBody> extends Request {
    params: ReqParams,
    query: ReqQuery,
    body: ReqBody
}
