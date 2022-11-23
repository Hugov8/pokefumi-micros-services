import Database from "better-sqlite3";
import * as path from "path";
import * as fs from "fs";
import {Pokemon} from "./models";

export default class StoreRepository {
    db: Database.Database

    constructor() {
        this.db = new Database('db/store.db', {verbose: console.log});
        this.applyMigrations();
    }

    applyMigrations() {
        const applyMigration = (path: string) => {
            const migration = fs.readFileSync(path, 'utf8')
            this.db.exec(migration);
        }

        const testRow = this.db.prepare("SELECT name from sqlite_schema where type = 'table' and name = 'pokemon'").get();

        if(!testRow) {
            console.log('Applying migrations on DB store...')
            const migrations = ["db/migrations/init.sql"]
            migrations.forEach(applyMigration)
        }
    }

    getAll() : Array<Pokemon> {
        const statement = this.db.prepare("SELECT * from pokemon");
        return statement.all();
    }

}