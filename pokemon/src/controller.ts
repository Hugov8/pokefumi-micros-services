import fetch from "node-fetch";
import {Pokemon} from "./models";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemon(id: number): Promise<Pokemon> {
    const res = await fetch(BASE_URL + "/pokemon/" + id);
    return res.json().then((pokemon) => {
        return {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height,
            weight: pokemon.weight,
            base_experience: pokemon.base_experience
        };
    });
}