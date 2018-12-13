let  db  = require("nedb-async-await");

class Wallet {
    constructor() {
        this.Wallet = db.Datastore({
            filename:  './database/wallet.json',
            autoload: true
        });
    }

    async all() {
        return await this.Wallet.find({});
    }

    async insert(data) {
        return await this.Wallet.insert(data);
    }
}

const wallet = new Wallet();

module.exports = {wallet};