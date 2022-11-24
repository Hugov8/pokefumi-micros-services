export type Player = {
    user_id: string,
    username: string,
    credits: number,
    team: Omit<Team, "user_id">
}

export type Team = {
    user_id: string,
    pokemon1: number,
    pokemon2: number,
    pokemon3: number,
    pokemon4: number,
    pokemon5: number,
    pokemon6: number
}

export type Pokemon = {
    pokemon_id: number
    price: number
}