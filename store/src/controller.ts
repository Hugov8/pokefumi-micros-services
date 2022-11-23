import StoreRepository from "./repository";
import {Pokemon, PokemonApi} from "./models";
import axios from "axios";

const repository = new StoreRepository();

export async function getAllPokemon() {
    const list = repository.getAll();
    return await Promise.all(list.map(async (pokemon) => {
        const details: PokemonApi =
            await axios.get(`http://localhost:5003/pokemon/${pokemon.pokemon_id}`)
                .then(res => res.data);
        return {
            pokemon_id: pokemon.pokemon_id,
            price: pokemon.price,
            name: details.name,
            height: details.height,
            weight: details.weight,
            base_experience: details.base_experience
        }
    }));
}