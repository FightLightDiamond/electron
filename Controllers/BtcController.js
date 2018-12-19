const electron = require('electron');
const url = require('url');
const path = require('path');
const ethers = require('ethers');
const {app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut, Tray} = electron;
const mainMenuTemplate = require('../config/menu');
const {btc} = require('../Models/BTC');
const accountService = require('../Services/Account');

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
                title: 'Wallet'
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
            // const ctxMenu = require('./config/content-menu');
            // window.webContents.on('context-menu', function (e, params) {
            //     ctxMenu.popup(this.window, params.x, params.y)
            // });
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
                const wls = await btc.get({});
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
                const {Wallet} = ethers;
                const wallet = Wallet.createRandom();
                accountService.insert(wallet);
                data = {
                    status: 200,
                    data: wallet
                };
            } catch (e) {
                data = {
                    status: 200,
                    data: wallet
                };
            }
            window.webContents.send('btc:store', data);
        });

        ipcMain.on('btc:send', function (e, res) {
            let data = {};
            try {
                accountService.sends(res.private_key, res.to, res.amount);
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
                const a = accountService.restore(res.mnemonic);
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
                const a = accountService.remove({_id: _id});
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
