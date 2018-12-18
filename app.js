const electron = require('electron');
const url = require('url');
const path = require('path');
const ethers = require('ethers');
const {app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut, Tray} = electron;
const mainMenuTemplate = require('./config/menu');
const {wallet} = require('./Models/Wallet');
const WL = wallet;
let account = require('./Services/Account');

let mainWindow;

// Listen for app to be ready
app.on('ready', function () {
    try {
        // Create new window
        mainWindow = new BrowserWindow({
            width: 1024,
            height: 724,
            title: 'Wallet'
        });
        // Load html into window
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, './views/main-window.html'),
            protocol: 'file:',
            slashes: true
        }));

        mainWindow.on('closed', function () {
            app.quit();
        });

        // Build menu template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        // Insert menu
        Menu.setApplicationMenu(mainMenu);

        // const ctxMenu = require('./config/content-menu');
        // mainWindow.webContents.on('context-menu', function (e, params) {
        //     ctxMenu.popup(mainWindow, params.x, params.y)
        // });

        globalShortcut.register('Alt+1', function () {
            mainWindow.show();
        });
    } catch (e) {
        dialog.showErrorBox('Error', e.toString());
    }
});

app.on('will-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', function () {
    globalShortcut.unregisterAll();
});

ipcMain.on('wallet:index', async function (e, item) {
    let data = {};
    try {
        const wls = await WL.all();
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
    e.returnValue = data;
    // mainWindow.webContents.send('wallet:index', data)
});

// Catch wallet:create
ipcMain.on('wallet:create', async function (e, item) {
    let data = {};
    try {
        const {Wallet} = ethers;
        const wallet = Wallet.createRandom();
        WL.insert(wallet);
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
    mainWindow.webContents.send('wallet:store', data);
});

ipcMain.on('wallet:send', function (e, res) {
    let data = {};
    try {
        account.sends(res.private_key, res.to, res.amount);
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
    mainWindow.webContents.send('wallet:sent', data);
});

ipcMain.on('wallet:restore', function (e, res) {
    console.log(res);
    let data = {};
    try {
        const a = account.restore(res.mnemonic);
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
    //mainWindow.webContents.send('wallet:restored', data);
});

