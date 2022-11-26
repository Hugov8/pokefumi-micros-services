import { MatchData, ID, RoundData } from "./model"
import axios from "axios"

export function currentRound(match: MatchData): ID {
    switch(match.current_round){
        case 1: {
            return match.round1
        }
        case 2: {
            return match.round2
        }
        case 3: {
            return match.round3
        }
        default: {
            return -1
        }
    }
}


export function playRound(round: RoundData): number{

    //TODO appeler service pokemon pour avoir les stats
    const winner: number = round.pokemon_j1>round.pokemon_j2 ? 1 : 2
    return winner
}