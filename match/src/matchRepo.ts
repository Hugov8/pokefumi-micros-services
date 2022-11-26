import Database from "better-sqlite3";
import fs from 'fs';
import { ID, MatchData, RoundData } from "./model";

export default class MatchRepository {

    db: Database.Database

    constructor() {
        this.db = new Database('db/match.db', {verbose: console.log});
        this.applyMigrations()
    }

    applyMigrations() {
        const applyMigration = (path: string) => {
            const migration = fs.readFileSync(path, 'utf8')
            this.db.exec(migration)
        }

        const testRow = this.db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'match'").get()
        const testTable = this.db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'round'").get()

        if (!testRow) {
            console.log('Applying migrations on DB users...')
            const migrations = ["db/migrations/init.sql"]
            migrations.forEach(applyMigration)
        }
    }

    getAllMatch(): MatchData[] {
        const query = "SELECT * FROM match"
        const statement = this.db.prepare(query)
        return statement.all()
    }

    getOpenMatch(): ID[] {
        const query = "SELECT id FROM match WHERE open = TRUE AND status = 0"
        const statement = this.db.prepare(query)
        return statement.all()
    }

    joinMatch(idPlayer: ID, idMatch: ID): number {
        const query = "UPDATE match SET joueur2 = ?, status = 1 WHERE id = ? AND status = 0"
        const statement = this.db.prepare(query)
        return statement.run(idPlayer, idMatch).changes
    }

    getMatchSituation(match: ID): MatchData{
        const query = "SELECT * FROM match WHERE id = ?"
        const statement = this.db.prepare(query)
        return statement.get(match)
    }

    addMatch(j1: ID): ID {
        const query = "INSERT INTO match (joueur1, open, status, current_round) VALUES (?, TRUE, 0, 0)"
        const statement = this.db.prepare(query)
        return statement.run(j1).lastInsertRowid
    }

    endMatch(match: ID, winner:ID): number {
        const query = "UPDATE match SET winner = ?, status = -1 WHERE id=?"
        const statement = this.db.prepare(query)
        return statement.run(winner, match).changes
    }

    addRound(match: MatchData): ID {
        const query = "INSERT INTO round (match_id, status) VALUES (?, 0)"
        const query2 = "UPDATE match SET round"+(match.current_round+1)+" = ?, current_round = ? WHERE id = ?"
        
        console.log(query)
        console.log(query2)
        
        const statement = this.db.prepare(query)
        const idRound: ID = statement.run(match.id).lastInsertRowid
        if (this.db.prepare(query2).run(idRound, match.current_round+1, match.id).changes ==0){
            return -1
        }
        return idRound

    }

    addPokemonRound(round: ID, player: number, pokemon: ID): number {
        const query = "UPDATE round SET pokemon_j"+player+" = ?, status=1 WHERE id=?"
        const statement = this.db.prepare(query)
        return statement.run(pokemon, round).changes
    }

    playRound(round: ID, winner: ID): number {
        const query = "UPDATE round SET winner = ?, status = -1 WHERE id=?"
        const statement = this.db.prepare(query)
        return statement.run(winner, round).changes
    }

    getRound(round: ID): RoundData {
        const query = "SELECT * FROM round WHERE id=?"
        const statement = this.db.prepare(query)
        return statement.get(round)
    }

}