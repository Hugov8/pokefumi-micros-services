import PlayerRepository from "./repository";

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