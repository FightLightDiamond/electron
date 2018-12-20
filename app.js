const electron = require('electron');
const {app, dialog, globalShortcut, ipcMain} = electron;
var blockexplorer = require('blockchain.info/blockexplorer').usingNetwork(3);

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
    // ethWindows ? ethWindows.hide() : '';
});

async function getAddress() {
    // const address = await blockexplorer.getAddress('miKF9JdjMFd1KzAWzxjY2UD7LpF1WcKtzU');
    // console.log(address['txs']);
    // const address = 'miKF9JdjMFd1KzAWzxjY2UD7LpF1WcKtzU';
    // const Unspent = await blockexplorer.getUnspentOutputs(address);
    // console.log(Unspent.unspent_outputs);
    // const balance = await blockexplorer.getBalance(address);
    // console.log(balance);

}

getAddress();
