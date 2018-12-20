const electron = require('electron');
const {ipcRenderer, shell} = electron;

require('./menu');

const createNewWalletBtn = '#createNewWalletBtn';
$(createNewWalletBtn).click(function () {
    ipcRenderer.send('btc:create', '');
});

ipcRenderer.on('btc:store', function (e, wallet) {
    ipcRenderer.send('btc:index');
});

$(document).on('click', '.redirectAddress', function () {
    const address = $(this).attr('data-address');
    shell.openExternal(`https://live.blockcypher.com/btc-testnet/address/${address}`);
});

$(document).on('click', '.sendBtn', function () {
    const _id = $(this).attr('data-id');
    $('#wallet_id').val(_id);
});

ipcRenderer.send('btc:index');

ipcRenderer.on('btc:index', async function (e, result) {
    if (result.status === 200) {
        const wallets = result.data;
        console.log(result);
        let content = '';
        let balance = 0;
        let no = 1;
        // try {
        for (let wallet of wallets) {
            //await fetch(`https://blockchain.info/address/${wallet.address}?format=json`)
            await fetch(`http://testnet.blockchain.info/q/addressbalance/${wallet.address}`)
                .then(function (response) {
                    if (response.status === 200) {
                        return response.json();
                    }
                    return 0;
                })
                .then(function (myJson) {
                    balance = (myJson);
                });
            content += `
                <tr>
                <td>${no++}</td>
                    <td><a target="_blank" class="redirectAddress"
                    data-address="${wallet.address}"
                    >${wallet.address}</a></td>
                    <td>${balance / Math.pow(10, 8)} BTC</td>
                    <td class="text-right">
                        <button data-id="${wallet._id}"
                        class="btn btn-xs btn-default sendBtn" data-toggle="modal" 
                        data-target="#sendCoin">Send</button>
                    
                        <button data-address="${wallet.address}" data-id="${wallet._id}"
                        class="btn btn-xs btn-default receiveBtn" data-toggle="modal" 
                        data-target="#receiveCoin">Receive</button>                   
                        <button data-id="${wallet._id}" class="btn btn-xs btn-danger removeWalletBtn">
                        <i class="glyphicon glyphicon-trash"></i>
                        </button>                      
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
    ipcRenderer.send('btc:send', data);
    $('#sendCoin').modal('hide');
});

ipcRenderer.on('btc:sent', function (e, result) {
    if (result.status === 200) {
        ipcRenderer.send('btc:index');
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
});

const restoreForm = '#restoreForm';
$(restoreForm).submit(function (e) {
    e.preventDefault();
    const self = $(this);
    const data = self.serializeJSON();
    const result = ipcRenderer.sendSync('btc:restore', data);
    if (result.status === 200) {
        alert('Restore Successful');
        ipcRenderer.send('btc:index');
    } else {
        alert('Restore Fail');
    }
    $('#restoreModal').modal('hide');
});

const removeWalletBtn = '.removeWalletBtn';
$(document).on('click', removeWalletBtn, function () {
    const ok = confirm('Are you sure?');
    if (ok) {
        const self = $(this);
        const _id = self.attr('data-id');
        const result = ipcRenderer.sendSync('btc:remove', _id);
        console.log(result);
        if (result.status === 200) {
            self.parents('tr').remove();
            alert('Remove Successful');
            // ipcRenderer.send('btc:index');
        } else {
            alert('Remove Fail');
        }
    }
});

