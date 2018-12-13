## Thực hành

### Cài đặt thư viện
```
npm i --save ethers
npm i --save nedb
```
### Khởi tạo
- Nedb
```
var Datastore = require('nedb')
    , db = new Datastore({ filename: './database/db.json', autoload: true })
```
- Ethers
```
const ethers = require('ethers');
```
### Bài toán cụ thể
- Client khởi lệnh tạo ví ảo
```
const electron = require('electron');
const {ipcRenderer} = electron;
ipcRenderer.send('wallet:create','ETH');
```
- App thực hiện tạo ví và lưu lại dữ liệu
```
const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron;
ipcMain.on('wallet:create', function (e, item) {
    const { Wallet } = ethers;
    const wallet = Wallet.createRandom();
    console.log(wallet);
    db.insert(wallet);
    mainWindow.webContents.send('wallet:store', wallet);
});
```
### Kết quả
Tạo được wallet và dữ liệu lưu tại `./database/db.json`
```
{"signingKey":{"mnemonic":"staff eight island lava pipe throw resource canoe axis develop increase pen","path":"m/2147483692'/2147483708'/2147483648'/0/0","privateKey":"0x44c274d1c866eede2880500671ec82f1f8f7a99a92ec8f77e5556ae38cf957a5","keyPair":{"privateKey":"0x44c274d1c866eede2880500671ec82f1f8f7a99a92ec8f77e5556ae38cf957a5","publicKey":"0x04926582e24d1b9ac7fae334cc2f2e561f6dbfdea36166dc0d802c047009141ab51c63512a69e7218ca7d0fc4f03cb26f027d22885883964f401d0d2c2107ed71c","compressedPublicKey":"0x02926582e24d1b9ac7fae334cc2f2e561f6dbfdea36166dc0d802c047009141ab5","publicKeyBytes":[2,146,101,130,226,77,27,154,199,250,227,52,204,47,46,86,31,109,191,222,163,97,102,220,13,128,44,4,112,9,20,26,181]},"publicKey":"0x04926582e24d1b9ac7fae334cc2f2e561f6dbfdea36166dc0d802c047009141ab51c63512a69e7218ca7d0fc4f03cb26f027d22885883964f401d0d2c2107ed71c","address":"0x7e77a7aA5a113F268c5466ccaBCc591370f314f8"},"_id":"oz7HD1h9Q2OouIjx"}
```
### Demo liên tục được cập nhật [tại đây](https://github.com/FightLightDiamond/electron)