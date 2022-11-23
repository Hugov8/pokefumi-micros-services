//type for a pokemon stored in the db
export type PokemonDb = {
    pokemon_id: number
    price: number
}

//type from pokemon service
export type PokemonApi = {
    id: number,
    name: string,
    height: number,
    weight: number,
    base_experience: number
}

//Return type to the api
export type Pokemon = {
    pokemon_id: number,
    price: number,
    name: string
    height: number,
    weight: number,
    base_experience: number
}