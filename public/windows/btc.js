const electron = require('electron');
const {ipcRenderer, shell} = electron;
const belt = require("bitcoin-utility-belt");
require('./menu');

const createNewWalletBtn = '#createNewWalletBtn';
$(createNewWalletBtn).click(function () {
    const seedWallets = belt.wallet.createSeed(1, "P2PKH", 49,   true);
    const data = {
        mnemonic: seedWallets.seed,
        address: seedWallets.wallets[0].address,
        private_key: seedWallets.wallets[0].privateKey,
    };
    ipcRenderer.send('btc:create', data);
});

ipcRenderer.on('btc:store', function (e, res) {
    if (res.status === 200) {
        showMnemonic(res.data.mnemonic)
        ipcRenderer.send('btc:index');
        alert('Create Successful');
    } else {
        alert('Create Fail');
    }

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

async function getBalance(address) {
    let balance = 0;
    await fetch(`http://testnet.blockchain.info/q/addressbalance/${address}`)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
            return 0;
        })
        .then(function (myJson) {
            balance = (myJson);
        });
    return balance;
}

ipcRenderer.on('btc:index', async function (e, result) {
    if (result.status === 200) {
        const wallets = result.data;
        // console.log(wallets);
        let content = '';
        let balance = 0;
        let no = 1;

        for (let wallet of wallets) {
            //await fetch(`https://blockchain.info/address/${wallet.address}?format=json`)
            balance = await getBalance(wallet.address);
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

$(document).on('click', '#mnemonicText', function () {
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

    // recover address
    let addresses = belt.wallet.recoverSeed( data.mnemonic, 1,"P2PKH",49,  true);
    addresses = addresses[0];
    data.address = addresses.address;
    data.private_key = addresses.privateKey;

    const result = ipcRenderer.sendSync('btc:restore', data);

    if (result.status === 200) {
        alert('Restore Successful');
        ipcRenderer.send('btc:index');
    } else {
        alert('Restore Fail');
    }
    $('#restoreModal').modal('hide');
});

function showMnemonic(mnemonic) {
    $('#mnemonicText').val(mnemonic);
    $('#mnemonicQrImage').html('').qrcode({
        size: '200',
        render: 'image',
        text: mnemonic
    });
    $('#mnemonicModal').modal('show');
}

const removeWalletBtn = '.removeWalletBtn';
$(document).on('click', removeWalletBtn, function () {
    const ok = confirm('Are you sure?');
    if (ok) {
        const self = $(this);
        const _id = self.attr('data-id');
        const result = ipcRenderer.sendSync('btc:remove', _id);
        if (result.status === 200) {
            self.parents('tr').remove();
            alert('Remove Successful');
        } else {
            alert('Remove Fail');
        }
    }
});


//const seeder = 'cherry actor round kiss attract sand enlist balance eye wear town task';
// const seeder = 'tone recipe surprise prison radio common parade game verify patch cricket device';
seedWallets = belt.wallet.createSeed(1, "P2PKH", 49,  true);
console.log("P2PKH wallet", seedWallets);

// // recover address
addresses = belt.wallet.recoverSeed(seedWallets.seed, 1, "P2PKH", 49, true);
console.log(addresses);
// // recover address
//
addresses = belt.wallet.recoverSeed(seedWallets.seed, 1, "P2SH", 49, true);
console.log(addresses);

// recover address
addresses = belt.wallet.recoverSeed(seedWallets.seed, 1, "P2WPKH", 49, true);
console.log(addresses);

// recover address
addresses = belt.wallet.recoverSeed(seedWallets.seed, 1, "P2WSH", 49, true);
console.log(addresses);
