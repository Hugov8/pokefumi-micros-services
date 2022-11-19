import Database from "better-sqlite3";
import fs from 'fs';
import "./authModel";
import { AllUsers, LoginInfo } from "./authModel";

export default class AuthRepository {

    db: Database.Database

    constructor() {
        this.db = new Database('db/auth.db', {verbose: console.log});
        this.applyMigrations()
    }

    applyMigrations() {
        const applyMigration = (path: string) => {
            const migration = fs.readFileSync(path, 'utf8')
            this.db.exec(migration)
        }

        const testRow = this.db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'auth'").get()

        if (!testRow) {
            console.log('Applying migrations on DB users...')
            const migrations = ["db/migrations/init.sql"]
            migrations.forEach(applyMigration)
        }
    }

    getAllUsers(): AllUsers {
        const query = "SELECT login, password FROM auth"
        const statement = this.db.prepare(query);
        return statement.all()
    }

    getUser(username: string): LoginInfo {
        const query = "SELECT login, password FROM auth WHERE login = ?"
        const statement = this.db.prepare(query);
        return statement.get(username)
    }

    getLoginInfo(info: LoginInfo): LoginInfo {
        const query = "SELECT login, password FROM auth WHERE login= ? AND password= ?"
        const statement = this.db.prepare(query);
        return statement.get(info.login, info.password)
    }

    registerPlayer(info: LoginInfo) {
        const query = "INSERT INTO auth (login, password) VALUES (?, ?)"
        const statement = this.db.prepare(query)
        return statement.run(info.login, info.password).lastInsertRowid
    }

    modifyPassword(info: LoginInfo) {
        const query = "UPDATE auth SET password = ? WHERE login = ?"
        const statement = this.db.prepare(query)
        return statement.run(info.password, info.login)
    }
}