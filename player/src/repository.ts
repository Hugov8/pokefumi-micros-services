import Database from "better-sqlite3";
import {Pokemon, Player, Team} from "./model";
import fs from 'fs';

export default class PlayerRepository {

    db: Database.Database

    constructor() {
        this.db = new Database('db/player.db', {verbose: console.log});
        this.applyMigrations()
    }

    applyMigrations() {
        const applyMigration = (path: string) => {
            const migration = fs.readFileSync(path, 'utf8')
            this.db.exec(migration)
        }

        const testRow = this.db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'player'").get()

        if (!testRow) {
            console.log('Applying migrations on DB player...')
            const migrations = ["db/migrations/init.sql"]
            migrations.forEach(applyMigration)
        }
    }

    getPlayer(playerId: number): Player {
        const statement = this.db.prepare("SELECT * FROM player WHERE user_id = ?")
        return statement.get(playerId);
    }
    
    allPlayer(): Player[] {
        const statement = this.db.prepare("SELECT * FROM player")
        return statement.all()
    }

    getTeam(playerId: number) : Team {
        const statement = this.db.prepare("SELECT * FROM team WHERE user_id = ?")
        return statement.get(playerId);
    }

    modifyPlayer(playerId: number, data: Player) {
        const statement = this.db.prepare("UPDATE player SET username = ? WHERE user_id = ?");
        statement.run(data.username, playerId);
    }

    addPlayer(playerId: number) {
        const statement = this.db.prepare("INSERT INTO player (user_id, credits) VALUES (?, 100)")
        statement.run(playerId)
    }

    createTeam(playerId: number) {
        const statement = this.db.prepare("INSERT or REPLACE INTO team(user_id) VALUES(?)");
        statement.run(playerId);
    }

    addPokemonToTeam(id: number, pokemon_id: number, user_id: number) {
        const statement = this.db.prepare(`UPDATE team SET pokemon${id} = ? where user_id = ?`);
        statement.run(pokemon_id, user_id);
    }

    setCredit(user_id: number, credit: number) {
        const statement = this.db.prepare("UPDATE player SET credits = ? where user_id = ?");
        statement.run(credit, user_id);
    }
}