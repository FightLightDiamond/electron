let  db  = require("nedb-async-await");

export class User {
    constructor() {
         this.User = db.Datastore({
            filename:  './database/users.json',
            autoload: true
        });
    }

    async all() {
        return await this.User.find({});
    }
}