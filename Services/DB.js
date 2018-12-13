export class DB {
    constructor() {
        const Datastore = require('nedb');
        this.db = new Datastore({filename: './database/db.json', autoload: true});
    }

    all() {
        let data = {};
        this.db.find({}, function (err, result) {
            data = result;
        });
        return data;
    }
}