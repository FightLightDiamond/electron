const electron = require('electron');
const {ipcRenderer, shell} = electron;
const ul = document.querySelector('ul');
const ethers = require('ethers');

require('./menu');

const EthService = {
    network: 'ropsten',
    providerUrl: 'http://ropsten.infura.io',
    broadcastTransactionUrl: 'https://ropsten.etherscan.io',
};
const provider = new ethers.providers.EtherscanProvider(EthService.network);

ipcRenderer.on('item:add', function (e, item) {
    const li = document.createElement('li');
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});

const createNewWalletBtn = '#createNewWalletBtn';
$(createNewWalletBtn).click(function () {
    ipcRenderer.send('eth:create', '');
    //const reply = ipcRenderer.sendSync('sync-msg');
});

ipcRenderer.on('eth:store', function (e, wallet) {
    ipcRenderer.send('eth:index');
});

$(document).on('click', '.redirectAddress', function () {
    const address = $(this).attr('data-address');
    shell.openExternal(`https://ropsten.etherscan.io/address/${address}`);
});

$(document).on('click', '.addressBtn', function () {
    const address = $(this).attr('data-address');
    $('#private_key').val(address);
});

ipcRenderer.send('eth:index');
ipcRenderer.send('menu:eth');

ipcRenderer.on('eth:index', async function (e, result) {
    if(result.status === 200) {
        const wallets = result.data;
        let content = '';
        let balance;
        let no = 1;
        // try {
            for (let wallet of wallets) {
                const wl = new ethers.Wallet(wallet.private_key, provider);
                balance = await wl.getBalance();
                content += `
                    <tr>
                    <td>${no++}</td>
                        <td><a target="_blank" class="redirectAddress"
                        data-address="${wallet.address}"
                        >${wallet.address}</a></td>
                        <td>${balance/Math.pow(10, 18)} ETH</td>
                        <td class="text-right">
                            <button data-address="${wallet.private_key}" data-id="${wallet._id}"
                            class="btn btn-xs btn-default addressBtn" data-toggle="modal" 
                            data-target="#sendCoin">Send</button>
                        
                            <button data-address="${wallet.address}" data-id="${wallet._id}"
                            class="btn btn-xs btn-default receiveBtn" data-toggle="modal" 
                            data-target="#receiveCoin">Receive</button>
                            
                            <button data-id="${wallet._id}" class="btn btn-xs btn-danger removeWalletBtn"><i class="glyphicon glyphicon-trash"></i></button>
                          
                        </td>
                    </tr>
                `;
            }
        // } catch (e) {
        //
        // }
        $('#loadProgress').html('');
        $('#contentTable').html(content);
    } else {
        alert('Error')
    }
});

$('#sendForm').submit(function (e) {
    e.preventDefault();
    const self = $(this);
    const data = self.serializeJSON();
    ipcRenderer.send('eth:send', data);
    $('#sendCoin').modal('hide');
});

ipcRenderer.on('eth:sent', function (e, result) {
    if(result.status === 200) {
        alert('Send Successful');
    } else {
        alert('Send Fail');
    }
});

$(document).on('click', '.receiveBtn', function () {
    const address = $(this).attr('data-address');
    $('#myAddress').val(address);
    $('#QrImage').html('').qrcode({
        size: '200',
        render: 'image',
        text: address
    });
});

$(document).on('click', '#myAddress', function () {
    const copyText = $(this);
    copyText.select();
    document.execCommand("copy");
    alert('Copied');
    // toastr.success(localization[lang].copy, '', 10000);
});

const restoreForm = '#restoreForm';
$(restoreForm).submit(function (e) {
    e.preventDefault();
    const self = $(this);
    const data = self.serializeJSON();
    const result = ipcRenderer.sendSync('eth:restore', data);
    if(result.status === 200) {
        alert('Restore Successful');
        ipcRenderer.send('eth:index');
    } else {
        alert('Restore Fail');
    }
    $('#restoreModal').modal('hide');
});

const removeWalletBtn = '.removeWalletBtn';
$(document).on('click', removeWalletBtn, function () {
    const ok = confirm('Are you sure?');
    if(ok) {
        const self = $(this);
        const _id = self.attr('data-id');
        const result = ipcRenderer.sendSync('eth:remove', _id);
        if(result.status === 200) {
            alert('Remove Successful');
            ipcRenderer.send('eth:index');
        } else {
            alert('Remove Fail');
        }
    }
});
