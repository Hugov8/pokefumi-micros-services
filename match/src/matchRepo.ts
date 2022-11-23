import Database from "better-sqlite3";
import fs from 'fs';

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

        if (!testRow) {
            console.log('Applying migrations on DB users...')
            const migrations = ["db/migrations/init.sql"]
            migrations.forEach(applyMigration)
        }
    }

    getAllMatch() {
        const query = "SELECT * FROM match"
        const statement = this.db.prepare(query)
        return statement.all()
    }

    addMatch(j1: number, j2: number) {
        const query = "INSERT INTO match (joueur1, joueur2, open, status) VALUES (?, ?, TRUE, 0)"
        const statement = this.db.prepare(query)
        return statement.run(j1,j2)
    }

}