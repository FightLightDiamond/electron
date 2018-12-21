const electron = require('electron');
const {app, dialog, globalShortcut, ipcMain} = electron;

global.__basedir = __dirname;
const ethController = require('./Controllers/EthController');
const btcController = require('./Controllers/BtcController');

let ethWindows = null;
let btcWindows = null;

// Listen for app to be ready
app.on('ready', function () {
    try {
        ethWindows = ethController.load();
    } catch (e) {
        dialog.showErrorBox('Error', e.toString());
    }
});

app.on('will-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', function () {
    globalShortcut.unregisterAll();
});

ipcMain.on('menu:eth', function (e, wallet) {
    ethWindows = ethController.load();
    if(btcWindows) {
        const position = btcWindows.getPosition();
        btcWindows.hide();
        ethWindows.setPosition(position[0], position[1])
    }
    ethWindows.show();
});

ipcMain.on('menu:btc', function (e, wallet) {
    btcWindows = btcController.load();
    if(ethWindows) {
        const position = ethWindows.getPosition();
        ethWindows.hide();
        btcWindows.setPosition(position[0], position[1])
    }
    btcWindows.show();
});

