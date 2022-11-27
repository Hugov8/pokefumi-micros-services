import { MatchData, ID, RoundData, Pokemon } from "./model"
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

async function getPokemon(idPokemon: ID): Promise<any> {
    return await axios.get("http://pokemon:5003/pokemon/"+idPokemon).then((res)=>{
        if(res.status == 200){
            return res.data
        }
    }).catch( (err) =>{
        console.log(err)
        return undefined
    })
}

//Juge puissance pokemon sur son expérience de base
const forcePokemon = (pokemon: Pokemon) => pokemon.base_experience

export function playRound(round: RoundData): number{

    //TODO appeler service pokemon pour avoir les stats
    const pokemon1: Promise<Pokemon> = getPokemon(round.pokemon_j1).then(val => val).catch(err => console.log(err))
    const pokemon2: Promise<Pokemon> = getPokemon(round.pokemon_j2).then(val => val).catch(err => console.log(err))
    
    let winner: number = -1
    Promise.all([pokemon1, pokemon2]).then(value => {
        winner = forcePokemon(value[0])>forcePokemon(value[1]) ? 1 : 2
    }).catch(err => {
        console.log(err)
    })

    return winner
}