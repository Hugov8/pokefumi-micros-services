import PlayerRepository from "./repository";
import {Pokemon, Player, Team} from "./model";

const repository = new PlayerRepository();

export function getPlayer(playerId: number): Player {
    let user = repository.getPlayer(playerId);
    user.team = repository.getTeam(playerId);
    return user;
}

export function modifyPlayer(playerId: number, data: Player): Player {
    repository.modifyPlayer(playerId, data);
    return repository.getPlayer(playerId);
}

export function addPlayer(playerId: number){
    repository.addPlayer(playerId)
    return repository.getPlayer(playerId)
}

export function allPlayer(): Player[] {
    return repository.allPlayer()
}

export function addPokemon(playerid: number, pokemon: Pokemon): Player | null {
    let team : Team = repository.getTeam(playerid);
    let added: boolean = false;
    for(let i = 1; i<=6; i++) {
        // @ts-ignore
        if(team[`pokemon${i}`] == undefined) {
            repository.addPokemonToTeam(i, pokemon.pokemon_id, playerid);
            added = true;
            break;
        }
    }
    if(!added) {
        return null;
    } else {
        const current_credit = repository.getPlayer(playerid);
        repository.setCredit(playerid, current_credit.credits - pokemon.price);
    }
    return getPlayer(playerid);
}