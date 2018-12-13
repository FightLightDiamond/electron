const electron = require('electron');
const url = require('url');
const path = require('path');
const ethers = require('ethers');
const {app, BrowserWindow, Menu, ipcMain} = electron;

const {wallet} = require('./Models/Wallet');
const WL = wallet;
let db = require("nedb-async-await");

// console.log();

const User = db.Datastore({
    filename: './database/db.json',
    autoload: true
});

let mainWindow;


// Listen for app to be ready
app.on('ready', function () {
    // Create new window
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 724,
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
});

// Handle create add window
let addWindow;

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 700,
        height: 500,
        title: 'Add Shopping List Item'
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/add.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null;
    });
}

// Catch item:add
ipcMain.on('item:add', function (e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

ipcMain.on('wallet:index', async function (e, item) {
    const wls = await WL.all();
    console.log('wls', wls);
    mainWindow.webContents.send('wallet:index', wls);
});

// Catch wallet:create
ipcMain.on('wallet:create', function (e, item) {
    const {Wallet} = ethers;
    const wallet = Wallet.createRandom();
    WL.insert(wallet);
    mainWindow.webContents.send('wallet:store', wallet);
});

ipcMain.on('wallet:send', function (e, data) {
    try {
        let account = require('./Services/Account');
        account.sends(data.private_key, data.to, data.amount);
        mainWindow.webContents.send('wallet:sent', 200);
    } catch (e) {
        mainWindow.webContents.send('wallet:sent', 500);
    }

});

const mainMenuTemplate = [
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' }
        ]
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {label: 'Clear Item'},
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            },
        ],

    }
];

//If mac, add empty object to menu

if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}
