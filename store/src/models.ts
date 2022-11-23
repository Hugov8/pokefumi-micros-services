export type Pokemon = {
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