const electron = require('electron');
const url = require('url');
const path = require('path');
const ethers = require('ethers');
const {app, BrowserWindow, Menu, ipcMain, dialog, globalShortcut, Tray} = electron;
const mainMenuTemplate = require('./config/menu');
const {wallet} = require('./Models/Wallet');
const WL = wallet;

let mainWindow;

const Realm = require('realm');

// Define your models and their properties
const CarSchema = {
    name: 'Car',
    properties: {
        make:  'string',
        model: 'string',
        miles: {type: 'int', default: 0},
    }
};
const PersonSchema = {
    name: 'Person',
    properties: {
        name:     'string',
        birthday: 'date',
        cars:     'Car[]',
        picture:  'data?' // optional property
    }
};

Realm.open({schema: [CarSchema, PersonSchema]})
    .then(realm => {
        // Create Realm objects and write to local storage
        realm.write(() => {
            const myCar = realm.create('Car', {
                make: 'Honda',
                model: 'Civic',
                miles: 1000,
            });
            myCar.miles += 20; // Update a property value
        });

        // Query Realm for all cars with a high mileage
        const cars = realm.objects('Car').filtered('miles > 1000');

        // Will return a Results object with our 1 car
        cars.length // => 1

        // Add another car
        realm.write(() => {
            const myCar = realm.create('Car', {
                make: 'Ford',
                model: 'Focus',
                miles: 2000,
            });
        });

        // Query results are updated in realtime
        cars.length // => 2
    })
    .catch(error => {
        console.log(error);
    });

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

        const ctxMenu = require('./config/content-menu');
        mainWindow.webContents.on('context-menu', function (e, params) {
            ctxMenu.popup(mainWindow, params.x, params.y)
        });

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
        console.log('wls', wls);
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
    mainWindow.webContents.send('wallet:index', data)
});

// Catch wallet:create
ipcMain.on('wallet:create', function (e, item) {
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
        let account = require('./Services/Account');
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

