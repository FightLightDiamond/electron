const electron = require('electron');
const url = require('url');
const path = require('path');
const ethers = require('ethers');
const {app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut, Tray} = electron;
const mainMenuTemplate = require('../config/menu');
const {eth} = require('../Models/ETH');
const ethService = require('../Services/EthService');

class EthController {

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
                title: 'Eth wallet'
            });
            // Load html into window
            this.window.loadURL(url.format({
                pathname: path.join(__basedir, './views/eth.html'),
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
        ipcMain.on('eth:index', async function (e, item) {
            let data = {};
            try {
                const wls = await eth.get({});
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
            window.webContents.send('eth:index', data)
        });

        // Catch eth:create
        ipcMain.on('eth:create', async function (e, item) {
            let data = {};
            try {
                const {Wallet} = ethers;
                const wallet = Wallet.createRandom();
                ethService.insert(wallet);
                data = {
                    status: 200,
                    data: wallet
                };
            } catch (e) {
                data = {
                    status: 500,
                    data: e.toString()
                };
            }
            window.webContents.send('eth:store', data);
        });

        ipcMain.on('eth:send', function (e, res) {
            let data = {};
            try {
                ethService.sends(res.private_key, res.to, res.amount);
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
            window.webContents.send('eth:sent', data);
        });

        ipcMain.on('eth:restore', function (e, res) {
            let data = {};
            try {
                const a = ethService.restore(res.mnemonic);
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

        ipcMain.on('eth:remove', function (e, _id) {
            let data = {};
            try {
                const a = ethService.remove({_id: _id});
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

let ethController = new EthController();

module.exports = ethController;
