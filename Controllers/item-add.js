const electron = require('electron');
const url = require('url');
const path = require('path');
const ethers = require('ethers');
const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;
//Handle create add window

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
// ipcMain.on('item:add', function (e, item) {
//     mainWindow.webContents.send('item:add', item);
//     addWindow.close();
// });