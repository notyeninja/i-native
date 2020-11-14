import { Injectable } from "@angular/core";
import {
	SQLite,
	SQLiteDatabaseConfig,
	SQLiteObject
} from "@ionic-native/sqlite/ngx";

@Injectable()
export class DbService {
	private dbConfig: SQLiteDatabaseConfig = {
		name: "t.db",
		location: "default"
	};

	private db: SQLiteObject;

	constructor(private sqlite: SQLite) {}

	initializeDatabase(): void {
		this.sqlite
			.create(this.dbConfig)
			.then((db: SQLiteObject) => {
				this.db = db;
				this.db
					.executeSql(
						`
        create table if not exists test(id integer primary key autoincrement not null,
            payload text)
      `
					)
					.catch(e => console.log(e));

				this.db
					.executeSql(
						`create table if not exists error(id integer primary key autoincrement not null, 
                              error text)`
					)
					.catch(e => console.log(e));
			})
			.catch(e => console.log(e));
	}

	async insertTestData(payload: any): Promise<boolean> {
		try {
			payload = JSON.stringify(payload);
			const result = await this.db.executeSql(
				`insert into test(payload) values (?)`,
				[payload]
			);
		} catch (err) {
			console.log(err);
			return false;
		}
		return true;
	}

	async getTestData(): Promise<any> {
		try {
			let payload = await this.db.executeSql(
				`select id, payload from test`,
				[]
			);
			let data = [];
			for (let i = 0; i < payload.rows.length; i++) {
				data.push({
					id: payload.rows.item(i).id,
					payload: payload.rows.item(i).payload
				});
			}
			return data;
		} catch (err) {
			console.log(err);
		}
	}

	async insertError(err: any): Promise<boolean> {
		try {
			err = JSON.stringify(err);
			const result = await this.db.executeSql(
				`insert into error(error) values (?)`,
				[err]
			);
		} catch (e) {
			console.log(e);
			return false;
		}

		return true;
	}

	async getErrors(): Promise<any> {
		try {
			let errors = await this.db.executeSql(`select * from error`, []);
			let data = [];
			for (let i = 0; i < errors.rows.length; i++) {
				data.push({
					id: errors.rows.item(i).id,
					error: errors.rows.item(i).error
				});
			}
			return data;
		} catch (e) {
			console.log(e);
		}
	}

	async deleteEverything(): Promise<any> {
		try {
			return await this.sqlite.deleteDatabase(this.dbConfig);
		} catch (err) {
			console.log(err);
		}
	}

	async cleanData(): Promise<any> {
		try {
			return await this.db.executeSql(
				"delete from test; delete from error",
				[]
			);
		} catch (err) {
			console.log(err);
		}
	}
}
