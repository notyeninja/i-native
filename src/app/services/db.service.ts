import { Injectable } from "@angular/core";
import {
  SQLite,
  SQLiteDatabaseConfig,
  SQLiteObject,
} from "@ionic-native/sqlite/ngx";

@Injectable()
export class DbService {
  private dbConfig: SQLiteDatabaseConfig = {
    name: "t.db",
    location: "default",
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
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }

  async insertTestData(payload: string): Promise<boolean> {
    try {
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
    try{
      let payload =  await this.db.executeSql(`select * from test`,[]);
      return JSON.parse(payload);
    }catch(err) {
      console.log(err);
    }
  }

//   async deleteEverything(): Promise<any> {
//     try{
//       return await this.db.executeSql(`select * from test`,[]);
//     }catch(err) {
//       console.log(err);
//     }
//   }

}
