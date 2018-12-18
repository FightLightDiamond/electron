const electron = require('electron');
const {ipcRenderer, shell} = electron;
const ul = document.querySelector('ul');
const ethers = require('ethers');
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
    ipcRenderer.send('wallet:create', '');
    //const reply = ipcRenderer.sendSync('sync-msg');
});

ipcRenderer.on('wallet:store', function (e, wallet) {
    ipcRenderer.send('wallet:index');
});

$(document).on('click', '.redirectAddress', function () {
    const address = $(this).attr('data-address');
    shell.openExternal(`https://ropsten.etherscan.io/address/${address}`);
});

$(document).on('click', '.addressBtn', function () {
    const address = $(this).attr('data-address');
    $('#private_key').val(address);
});

ipcRenderer.send('wallet:index');

ipcRenderer.on('wallet:index', async function (e, result) {
    if(result.status === 200) {
        const wallets = result.data;
        console.log(result);
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
                            <button data-address="${wallet.private_key}"
                            class="btn btn-xs btn-default addressBtn" data-toggle="modal" 
                            data-target="#sendCoin">Send</button>
                         
                            <button data-address="${wallet.address}"
                            class="btn btn-xs btn-default receiveBtn" data-toggle="modal" 
                            data-target="#receiveCoin">Receive</button>
                        </td>
                    </tr>
                `;
            }
        // } catch (e) {
        //
        // }
        $('#loadProgress').empty();
        $('#contentTable').html(content);
    } else {
        alert('Error')
    }
});

$('#sendForm').submit(function (e) {
    e.preventDefault();
    const self = $(this);
    const data = self.serializeJSON();
    ipcRenderer.send('wallet:send', data);
    $('#sendCoin').modal('hide');
});

ipcRenderer.on('wallet:sent', function (e, result) {
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
    const result = ipcRenderer.sendSync('wallet:restore', data);
    if(result.status === 200) {
        alert('Send Successful');
        ipcRenderer.send('wallet:index');
    } else {
        alert('Send Fail');
    }
});
