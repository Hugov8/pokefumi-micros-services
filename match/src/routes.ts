import * as express from "express";
import MatchRepository from "./matchRepo";
import * as jwt from "jsonwebtoken"
import { ApiRequest, ApiResponse, ID, MatchData, RoundData, Status } from "./model";
import { currentRound, playRound } from "./controller";

const matchRepo = new MatchRepository()
const privateKey = "1234"

export const register = (app: express.Application) => {
    app.get('/', (req, res) => res.send('<h1>Hello World</h1>'));


    app.post('/createMatch', (req: ApiRequest<never, never, never>, res: ApiResponse<ID>) => {
        const token: string = req.headers.token as string
        if(token==undefined){
            return res.status(400).json({message:"Please provide a token in header"})
        }

        const idPlayer = jwt.verify(token, privateKey) as {id: ID} 
        //const idPlayer : ID = req.query.idPlayer as unknown as ID
        
        if (idPlayer==undefined){
            return res.status(400).json({message: "Please provide a correct id"})
        }
        const idMatch = matchRepo.addMatch(idPlayer.id)

        return res.status(201).json({data: idMatch})
    })


    app.get('/openMatch', (_req: any, res: ApiResponse<ID[]>)=> {

        return res.status(200).json({data: matchRepo.getOpenMatch()})
    })

    app.post('/match/:idMatch/join', (req: ApiRequest<{idMatch: string}, never ,never>, 
        res: ApiResponse<string>)=>{
        const token: string = req.headers.token as string
        if(token==undefined){
            return res.status(400).json({message:"Please provide a token in header"})
        }
        
        const idPlayer = jwt.verify(token, privateKey) as {id: ID} 
        //const idPlayer : ID = req.header.token as ID
        const idMatch: ID = req.params.idMatch as unknown as ID

        if(idPlayer==undefined || idMatch==undefined){
            return res.status(400).json({message: "Please provide correct IDs"})
        }

        const change = matchRepo.joinMatch(idPlayer.id, idMatch)
        if (change==0){
            return res.status(403).json({message: "This match cannot be joined"})
        }
        return res.status(200).json({data: "success"})

    })

    app.post('/match/:id/winner', (req: ApiRequest<{id: string}, never, never>, 
        res: ApiResponse<ID>) => {
            const matchID: ID = req.params.id as unknown as ID
            if(matchID==undefined){
                return res.status(400).json({message: "Please provide a correct id of the match"})
            }
    
            const match: MatchData = matchRepo.getMatchSituation(matchID)
            if (match==undefined){
                return res.status(404).json({message: "Match not found"})
            }

            if(match.current_round!=3){
                return res.status(400).json({message: "Please play all rounds!"})
            }

            let victory1: number = 0
            const round1: RoundData = matchRepo.getRound(match.round1)
            victory1 = round1.winner==match.joueur1 ? victory1+1 : victory1
            const round2: RoundData = matchRepo.getRound(match.round2)
            victory1 = round2.winner==match.joueur1 ? victory1+1 : victory1
            const round3: RoundData = matchRepo.getRound(match.round3)
            victory1 = round3.winner==match.joueur1 ? victory1+1 : victory1

            const winner: ID = victory1>=2 ? match.joueur1 : match.joueur2
            if(matchRepo.endMatch(match.id, winner) == 0){
                return res.status(400).json({message: "Problem in the DB"})
            }
            return res.status(200).json({data: winner})
    })

    app.get('/match/:id', (req: ApiRequest<{id: string}, never, never>, res: ApiResponse<MatchData>)=> {
        const match: ID = req.params.id as unknown as ID
        if(match==undefined){
            return res.status(400).json({message: "Please provide a correct id of the match"})
        }

        const data: MatchData = matchRepo.getMatchSituation(match)
        if (data==undefined){
            return res.status(404).json({message: "Match not found"})
        }
        return res.status(200).json({data: data})
    })

    app.post('/match/:id/addPokemon', (req: ApiRequest<{id: string}, {idPokemon: string}, never>,
        res: ApiResponse<string>) => {
            const idMatch: ID = req.params.id as unknown as ID
            if(idMatch==undefined){
                return res.status(400).json({message: "Provide a correct id match"})
            }

            const match: MatchData = matchRepo.getMatchSituation(idMatch)
            if(match==undefined){
                return res.status(404).json({message: "Match not found"})
            }

            const token: string = req.headers.token as string
            if(token==undefined){
             return res.status(400).json({message:"Please provide a token in header"})
            }

            const idPlayer = jwt.verify(token, privateKey) as {id: ID} 
            if(idPlayer==undefined){
                res.status(400).json({message: "Wrong player token"})
            }
            else if (idPlayer.id!=match.joueur1 && idPlayer.id!=match.joueur2) {
                return res.status(403).json({message: "You don't have access to this match"})
            }

            const idPokemon: ID = req.query.idPokemon as unknown as ID
            if(idPokemon==undefined){
                return res.status(400).json({message: "Provide the id of the pokemon"})
            }
            
            const numJoueur: number = match.joueur1==idPlayer.id ? 1 : 2
            const change: number = matchRepo.addPokemonRound(currentRound(match), numJoueur, idPokemon)
            if(change==0){
                return res.status(400).json({message: "erreur inscritpion pokemon"})
            }

            return res.status(200).json({data: "success"})
        })

    app.post('/match/:id/play_round', (req: ApiRequest<{id: string}, never, never>, 
        res: ApiResponse<RoundData>) => {
            const idMatch: ID = req.params.id as unknown as ID
            if(idMatch==undefined){
                return res.status(400).json({message: "Provide a correct id match"})
            }

            const match: MatchData = matchRepo.getMatchSituation(idMatch)
            if(match==undefined){
                return res.status(404).json({message: "Match not found"})
            }

            const token: string = req.headers.token as string
            if(token==undefined){
             return res.status(400).json({message:"Please provide a token in header"})
            }

            const idPlayer = jwt.verify(token, privateKey) as {id: ID} 
            if(idPlayer==undefined){
                res.status(400).json({message: "Wrong player token"})
            }
            else if (idPlayer.id!=match.joueur1 && idPlayer.id!=match.joueur2) {
                return res.status(403).json({message: "You don't have access to this match"})
            }

            
            const round: RoundData = matchRepo.getRound(currentRound(match))
            if(round.pokemon_j1==undefined ||round.pokemon_j2==undefined){
                return res.status(400).json({message:"Wait until the two players choose the pokemon"})
            }

            const winner: ID = playRound(round)==1 ? match.joueur1 : match.joueur2
            const change: number = matchRepo.playRound(round.id, winner)
            if(change==0){
                return res.status(400).json({message: "erreur gagnant"})
            }
            round.winner = winner
            round.status = -1
            return res.status(200).json({data: round})
    })


    app.get('/match/:id/current_round', (req: ApiRequest<{id: string}, never, never>, 
        res: ApiResponse<RoundData>)=> {
        const idMatch: ID = req.params.id as unknown as ID
        if(idMatch==undefined){
            return res.status(400).json({message: "Please provide a correct match's ID"})
        }

        const match: MatchData = matchRepo.getMatchSituation(req.params.id as unknown as number)
        if(match==undefined){
            return res.status(404).json({message: "Match not found"})
        }

        const round: ID = currentRound(match)
        if (round==-1){
            return res.status(404).json({message: "Match has not begun yet"})
        }
        const data: RoundData = matchRepo.getRound(round)
        
        return res.status(201).json({data: data})

    })

    app.post('/match/:id/nextRound', (req: ApiRequest<{id: string}, never, never>, 
        res: ApiResponse<ID>)=> {
        const idMatch: ID = req.params.id as unknown as ID
        if(idMatch==undefined){
            return res.status(400).json({message: "Please provide a correct match's ID"})
        }

        const match: MatchData = matchRepo.getMatchSituation(req.params.id as unknown as number)
        if(match==undefined){
            return res.status(404).json({message: "Match not found"})
        }
        if(match.joueur1==undefined ||match.joueur2==undefined){
            return res.status(400).json({message: "Please wait until two player join the match"})
        }
        if(match.status== Status.FINISHED){
            return res.status(404).json({message: "The match is over"})
        }
        if(match.current_round!=0){
            if(match.current_round==3){
                return res.status(400).json({message: "All rounds are already created"})
            }
            const round: RoundData = matchRepo.getRound(currentRound(match))
            if (round.status != Status.FINISHED){
                return res.status(400).json({message: "Please finish the previous round before beginning a new one"})
            }
        }

        const round: ID = matchRepo.addRound(match)
        
        return res.status(201).json({data: round})

    })
}