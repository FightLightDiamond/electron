let db = require("nedb-async-await");
const AppDirectory = require('appdirectory');
const dirs = new AppDirectory({
    appName: "mycoolapp", // the app's name, kinda self-explanatory
    appAuthor: "Superman", // The author's name, or (more likely) the name of the company/organisation producing this software.
                           // Only used on Windows, if omitted will default to appName.
    appVersion: "v6000", // The version, will be appended to certain dirs to allow for distinction between versions.
                         // If it isn't present, no version parameter will appear in the paths
    useRoaming: true, // Should AppDirectory use Window's roaming directories?  (Defaults to false)
    platform: process.platform // You should almost never need to use this, it will be automatically determined
});

class Wallet {
    constructor() {
        this.Wallet = db.Datastore({
            filename: dirs.userData() + '/wallet.json',
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