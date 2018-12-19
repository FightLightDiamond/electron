const electron = require('electron');
const {ipcRenderer} = electron;

const menuBar = '.menuBar';

$(document).on('click', menuBar, function () {
    const self = $(this);
    const menu = self.attr('data-menu');
    ipcRenderer.send('menu:' + menu);
});
