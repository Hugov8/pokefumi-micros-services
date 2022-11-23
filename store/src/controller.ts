import StoreRepository from "./repository";
import {PokemonDb, PokemonApi, Pokemon} from "./models";
import axios from "axios";

const repository = new StoreRepository();

const pokemonInstance = axios.create({
    baseURL: "http://localhost:5003"
});

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