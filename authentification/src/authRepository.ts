import Database from "better-sqlite3";
import fs from 'fs';
import "./authModel";
import { AllUsers } from "./authModel";

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

        const testRow = this.db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'users'").get()

        if (!testRow) {
            console.log('Applying migrations on DB users...')
            const migrations = ["db/migrations/init.sql"]
            migrations.forEach(applyMigration)
        }
    }

    getAllUsers(with_deleted: boolean): AllUsers {
        const query = with_deleted ? "SELECT (username, u_password) FROM users" : "SELECT * FROM users WHERE deleted = false"
        const statement = this.db.prepare(query);
        return statement.all()
    }

    getUserById(userId: string, deleted: boolean=false): User {
        const statement = this.db.prepare("SELECT * from users WHERE user_id = ?"+ (deleted ? "":" AND deleted=false"))
        return statement.get(userId)
    }

    createUser(name: string, email: string, password: string, role: Role) {
        const statement = this.db.prepare("INSERT INTO users (name, email, password,user_type) VALUES (?, ?, ?, ?)")
        return statement.run(name, email, password, role).lastInsertRowid
    }

    getUserByName(name: string, with_deleted: boolean): User[] {
        const query = with_deleted
            ? "SELECT * FROM users WHERE name LIKE '%' || ? || '%'"
            : "SELECT * FROM users WHERE name LIKE '%' || ? || '%' and deleted = false";
        const statement = this.db.prepare(query);
        return statement.all(name)
    }

    getUserByEmail(email: string): User {
        const statement = this.db.prepare("SELECT * from users WHERE email = ? AND deleted=false")
        return statement.get(email)
    }

    checkCredentials(email: string, password: string): boolean {
        const statement = this.db.prepare("SELECT * FROM users WHERE email = ? and deleted = false")
        const user: User = statement.get(email);
        console.log(user);
        if (user == undefined) {
            return false
        }
        return user.password === password;
    }

    deleteUser(id: string) {
        const statement = this.db.prepare("UPDATE users SET deleted = true where user_id = ?");
        return statement.run(id);
    }

    modifyUser(user_id: string, columnName: string, value: string) {
        const statement = this.db.prepare("UPDATE users SET " + columnName + " = ? where user_id = ?");
        return statement.run(value, user_id);
    }
}