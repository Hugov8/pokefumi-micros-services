import Database from "better-sqlite3";
import fs from 'fs';
import { LoginInfo, Login, Token, Role } from "./adminModel";

export default class AdminRepository {

    db: Database.Database

    constructor() {
        this.db = new Database('db/admin.db', {verbose: console.log});
        this.applyMigrations()
    }

    applyMigrations() {
        const applyMigration = (path: string) => {
            const migration = fs.readFileSync(path, 'utf8')
            this.db.exec(migration)
        }

        const testRow = this.db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'loginToken'").get()

        if (!testRow) {
            console.log('Applying migrations on DB users...')
            const migrations = ["db/migrations/init.sql"]
            migrations.forEach(applyMigration)
        }
    }

    addToken(info: LoginInfo) {
        const query = "INSERT INTO loginToken (token, login, role) VALUES (?, ?, ?)"
        const statement = this.db.prepare(query)
        return statement.run(info.token, info.login, info.role).lastInsertRowid
    }

    getUserToken(token: Token): LoginInfo{
        const query = "SELECT * FROM loginToken WHERE token=?"
        const statement = this.db.prepare(query)
        return statement.get(token)
    }

    getAllRole(role: Role): LoginInfo[]{
        return this.db.prepare("SELECT * FROM loginToken WHERE role=?").all(role)
    }

    getAllToken(): LoginInfo[]{
        return this.db.prepare("SELECT * FROM loginToken").all()
    }

    removeToken(token: Token){
        const query = "DELETE FROM loginToken WHERE token=?"
        this.db.prepare(query).run(token)
    }

}