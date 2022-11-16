type Player = {
    user_id: string,
    username: string,
    team: Omit<Team, "user_id">
}

type Team = {
    user_id: string,
    pokemon1: number,
    pokemon2: number,
    pokemon3: number,
    pokemon4: number,
    pokemon5: number,
    pokemon6: number
}