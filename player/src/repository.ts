import Database from "better-sqlite3";
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
        const statement = this.db.prepare("SELECT user_id, username FROM player WHERE user_id = ?")
        return statement.get(playerId);
    }
    
    getTeam(playerId: number) : Team {
        const statement = this.db.prepare("SELECT * FROM team WHERE user_id = ?")
        return statement.get(playerId);
    }

    modifyPlayer(playerId: number, data: Player) {
        const statement = this.db.prepare("UPDATE player SET username = ? WHERE user_id = ?");
        statement.run(data.username, playerId);
    }
}