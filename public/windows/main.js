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
    $('#form').val(address);
});

ipcRenderer.send('wallet:index');

ipcRenderer.on('wallet:index', async function (e, result) {
    if(result.status === 200) {
        const wallets = result.data;
        let content = '';
        let balance;
        for (let wallet of wallets) {
            const wl = new ethers.Wallet(wallet.signingKey.privateKey, provider);
            balance = await wl.getBalance();
            content += `
                    <tr>
                        <td><a target="_blank" class="redirectAddress"
                        data-address="${wallet.signingKey.address}"
                        >${wallet.signingKey.address} ETH</a></td>
                        <td>${balance/Math.pow(10, 18)}</td>
                        <td class="text-right">
                            <button data-address="${wallet.signingKey.privateKey}"
                            class="btn btn-sm btn-primary addressBtn" data-toggle="modal" data-target="#myModal">Send</button>
                        </td>
                    </tr>
                `;
        }
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
    $('#myModal').modal('hide');
});

ipcRenderer.on('wallet:sent', function (e, result) {
    if(result === 200) {
        alert('Send Successful');
    } else {
        alert('Send Fail');
    }
});