let db = require("nedb-async-await");
const {storagePath} = require('../config/app');
const Base = require('./Base');

class ETH extends Base {
    constructor() {
        super();
        this.db = db.Datastore({
            filename: storagePath + '/eth.json',
            autoload: true
        });
    }
}

const eth = new ETH();

module.exports = {eth};
