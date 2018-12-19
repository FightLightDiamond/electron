const AppDirectory = require('appdirectory');
const storage = new AppDirectory({
    appName: "vincent-wallet", // the app's name, kinda self-explanatory
    appAuthor: "Fight Light Diamond", // The author's name, or (more likely) the name of the company/organisation producing this software.// Only used on Windows, if omitted will default to appName.
    appVersion: "v0.1", // The version, will be appended to certain dirs to allow for distinction between versions.
    // If it isn't present, no version parameter will appear in the paths
    useRoaming: true, // Should AppDirectory use Window's roaming directories?  (Defaults to false)
    platform: process.platform // You should almost never need to use this, it will be automatically determined
});
const storagePath = storage.userData();
module.exports = {storage, storagePath};