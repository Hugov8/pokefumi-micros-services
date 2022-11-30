import StoreRepository from "./repository";
import {PokemonDb, PokemonApi, Pokemon} from "./models";
import axios from "axios";

const repository = new StoreRepository();

const pokemonInstance = axios.create({
    baseURL: "http://pokemon:5003"
});

const playerInstance = axios.create({
    baseURL: "http://player:5001"
})

export async function getAllPokemon() {
    const list = repository.getAll();
    return await Promise.all(list.map(getPokemonDetails));
}

export async function getPokemon(id: number) {
    const pokemon = repository.getPokemonById(id);
    if(pokemon == undefined) {
        return {}
    }
    return await getPokemonDetails(pokemon);
}

async function getPokemonDetails(pokemon: PokemonDb): Promise<Pokemon> {
    const details: PokemonApi =
        await pokemonInstance.get(`/pokemon/${pokemon.pokemon_id}`)
            .then(res => res.data);
    return {
        pokemon_id: pokemon.pokemon_id,
        price: pokemon.price,
        name: details.name,
        height: details.height,
        weight: details.weight,
        base_experience: details.base_experience
    }
}

// Rôle de player ici ?
export async function buyPokemonForPlayer(pokemon: Pokemon, player_id: number) {
    return playerInstance.post(`/player/${player_id}/buy_pokemon`, <PokemonDb>{
        pokemon_id: pokemon.pokemon_id,
        price: pokemon.price
    });
}