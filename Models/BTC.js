let db = require("nedb-async-await");
const {storagePath} = require('../config/app');
const Base = require('./Base');

class BTC extends Base {
    constructor() {
        super();
        this.db = db.Datastore({
            filename: storagePath + '/btc.json',
            autoload: true
        });
    }
}

const btc = new BTC();

module.exports = {btc};
