const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut, Tray} = electron;
const mainMenuTemplate = require('../config/menu');
const btcService = require('../Services/BtcService');

class BtcController {

    constructor() {
        this.window = null;
    }

    load() {
        if(this.window === null) {
            this.window = new BrowserWindow({
                // x: 0, y: 0,
                // width: 1024,
                // height: 724,
                // modal: true,
                title: 'BTC wallet'
            });
            // Load html into window
            this.window.loadURL(url.format({
                pathname: path.join(__basedir, './views/btc.html'),
                protocol: 'file:',
                slashes: true
            }));
            this.window.on('closed', function () {
                app.quit();
            });
            // Build menu template
            const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
            // Insert menu
            Menu.setApplicationMenu(mainMenu);

            globalShortcut.register('Alt+1', function () {
                this.window.show();
            });
            this.ipcEvent(this.window);
        }
        this.window.center();
        return this.window;
    }

    ipcEvent(window) {
        ipcMain.on('btc:index', async function (e, item) {
            let data = {};
            try {
                const wls = await btcService.get({});
                data = {
                    status: 200,
                    data: wls
                }
            } catch (e) {
                data = {
                    status: 500,
                    data: e.toString()
                };
            }
            window.webContents.send('btc:index', data)
        });

        // Catch btc:create
        ipcMain.on('btc:create', async function (e, item) {
            let data = {};
            try {
                const btc = btcService.create();
                data = {
                    status: 200,
                    data: btc
                };
            } catch (e) {
                data = {
                    status: 500,
                    data: e.toString()
                };
            }
            window.webContents.send('btc:store', data);
        });

        ipcMain.on('btc:send', function (e, res) {
            let data = {};
            try {
                btcService.sends(res.private_key, res.to, res.amount);
                data = {
                    status: 200,
                    data: res
                }
            } catch (e) {
                data = {
                    status: 500,
                    data: e.toString()
                }
            }
            window.webContents.send('btc:sent', data);
        });

        ipcMain.on('btc:restore', function (e, res) {
            let data = {};
            try {
                const a = btcService.restore(res.mnemonic);
                console.log(a);
                data = {
                    status: 200,
                    data: res
                }
            } catch (e) {
                data = {
                    status: 500,
                    data: e.toString()
                }
            }
            return e.returnValue = data;
        });

        ipcMain.on('btc:remove', function (e, _id) {
            let data = {};
            try {
                const a = btcService.remove({_id: _id});
                console.log(a);
                data = {
                    status: 200,
                    data: _id
                }
            } catch (e) {
                data = {
                    status: 500,
                    data: e.toString()
                }
            }
            return e.returnValue = data;
        });
    }
}

let btcController = new BtcController();

module.exports = btcController;
