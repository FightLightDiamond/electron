Electron là nền tảng viết ứng dụng desktop hoàn toàn bằng HTML, JS, CSS.
### Khởi tạo project 
- Khởi tạo
```
mkdir electron
cd electron
npm init
npm i --save electron
touch app.js
```
- Cấu hình file package.json
```
{
  "name": "electron",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "electron": "^3.0.11"
  }
}
```
Ở đây chúng ta thấy file main là file app.js
Khi khởi động ứng dụng bằng lệnh `npm start` chúng ta thấy nó sẽ run lệnh `electron .`
### Điểm qua một số hàm sử dụng
#### Server
Khởi động và nạp dữ liệu ban đầu
```
app.on('ready', function () {
// Do something
});
```
- Khởi tạo một giao diện cửa sổ để làm việc
```
let mainWindow = new BrowserWindow({
 width: xxx,
 height: xxx,
 title: 'Name'
});
```
- Load giao diện từ file html
```
mainWindow.loadURL(url.format({
 pathname: path.join(__dirname, './views/file.html'),
 protocol: 'file:',
 slashes: true
}));
```
- Đóng một cửa sổ mainWindow
```
let mainWindow = new BrowserWindow({});
mainWindow.close();
```
- Đóng toàn ứng dụng
```
app.close();
```
- Bắt dữ liệu truyền lên client
```
const electron = require('electron');
const {ipcMain} = electron;
ipcMain.on('item:add', function (e, item) {
```
- Trả dữ liệu gửi đi một cửa sổ
```
let mainWindow = new BrowserWindow({});
mainWindow.webContents.send('item:add', item);
```
- Cấu hình một menu: label là tên, event là  sự kiện tác động đến menu, accelerator định nghĩa phím tắt
```
const mainMenuTemplate = [
    {
        label: 'Name',
        submenu: [
            {
                label: 'Name',
                event()
            },
            {label: 'Clear Item'},
            {
                label: 'Name',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            },
        ],
    }
];
```
Ở đây `process.platform === 'darwin'` là so sánh với môi trường sử dụng, iOs là darwin. Window là win32 hay win64 ...
- Xây dựng một menu template
```
const electron = require('electron');
const {Menu} = electron;
 // Build menu template
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
 // Insert menu
Menu.setApplicationMenu(mainMenu);
```
- Lấy dữ liệu từ file .env
```
process.env.NODE_ENV
```
#### Views
Đây là file Html, bạn viết hoàn toàn như tầng View của một ứng dụng web client.
- Gửi dữ liêu lên phía App
```
const electron = require('electron');
const {ipcRenderer} = electron;
const data = {data}
ipcRenderer.send('item:add', data);
```
-  Nhận dữ liệu từ App gửi xuống
```
const electron = require('electron');
const {ipcRenderer} = electron;
ipcRenderer.on('item:add', function (e, item) {
// Do something
})