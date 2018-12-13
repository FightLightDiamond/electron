const sendCoinForm = $('#sendCoinForm');
const WalletService = {};

const erc20Symbols = _.keys({
    mgc: {
        symbol: 'mgc',
        name: 'MGC',
        decimal: 8,
        address: '0x5337bb193963e5f904e3384fe8c873ba9ca908a5',
        transactionFee: 0.0005,
    },
    mgc4: {
        symbol: 'mgc4',
        name: 'MGC004',
        decimal: 18,
        address: '0xebf0c068cc1dd9b343e92bc2cc09a2ca272d6511',
        transactionFee: 0.0005,
    },
});

const EthService = {
    network: 'ropsten',
    providerUrl: 'http://ropsten.infura.io',
    broadcastTransactionUrl: 'https://ropsten.etherscan.io',
};

const web3 = new Web3(EthService.providerUrl);
WalletService.getCoinPrice = async (coin) => {
    try {
        const coinUpperCase = coin.toUpperCase();
        const apiUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coinUpperCase}&tsyms=USD,JPY,PHP`;
        const response = await axios.get(apiUrl);
        const coinInfo = response.data.RAW[coinUpperCase];
        return {
            priceUSD: coinInfo.USD.PRICE,
            priceJPY: coinInfo.JPY.PRICE,
            pricePHP: coinInfo.PHP.PRICE,
            percentChange24hUsd: coinInfo.USD.CHANGEPCT24HOUR,
            percentChange24hJpy: coinInfo.JPY.CHANGEPCT24HOUR,
        };
    } catch (error) {
        throw error;
    }
};
const sendCoin = '#sendCoin';
const mgcCoin = 'mgc4';

const Erc20Service = {
    network: 'ropsten',
    broadcastTransactionUrl: 'https://ropsten.etherscan.io',
    tokens: {
        mgc: {
            symbol: 'mgc',
            name: 'MGC',
            decimal: 8,
            address: '0x5337bb193963e5f904e3384fe8c873ba9ca908a5',
            transactionFee: 0.0005,
        },
        mgc4: {
            symbol: 'mgc4',
            name: 'MGC004',
            decimal: 18,
            address: '0xebf0c068cc1dd9b343e92bc2cc09a2ca272d6511',
            transactionFee: 0.0005,
        },
    },
};

const Erc20ABI = [
    {
        constant: false,
        inputs: [
            {
                name: 'spender',
                type: 'address',
            },
            {
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'from',
                type: 'address',
            },
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'who',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'spender',
                type: 'address',
            },
            {
                name: 'value',
                type: 'uint256',
            },
            {
                name: 'extraData',
                type: 'bytes',
            },
        ],
        name: 'approveAndCall',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: 'owner',
                type: 'address',
            },
            {
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        type: 'function',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
];

const ACTION_BY_SEND_COIN = 'send_coin';
const ACTION_BY_REQUEST_ADDRESS = 'request_address';

$.validator.addMethod("regexPass", function (value, element) {
    return this.optional(element) || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value);
}, "Passwords must contain at least 8 characters, uppercase letters, lowercase letters, and numbers");

$.validator.addMethod("is_eth_address", function (value, element) {
    return web3.isAddress(value)
}, "Address is invalid");

var inputPassport = document.querySelector("#passport_number");
$.validator.addMethod("passport_check", function (value, element) {
    var regex = /^[a-zA-Z0-9-]+$/;
    if (regex.test(inputPassport.value)) {
        return true;
    } else {
        return false;
    }
}, "The passport number enter only numbers and characters.");

if (document.getElementById('phone')) {
    var input = document.querySelector("#phone");
    // var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number", "THIS FIELD IS REQUIRED."];
    var errorMap = ["Invalid number", "Invalid country code", "Invalid number", "Invalid number", "Invalid number", "THIS FIELD IS REQUIRED."];
    var errorCode = '';
    var iti = window.intlTelInput(input, {
        hiddenInput: "phone_number",
        utilsScript: "/intl-tel/build/js/utils.js"
    });
    // iti.setCountry('vn');
    $.validator.addMethod("phone_check_login", function (value, element) {
        if (input.value.trim()) {
            if (iti.isValidNumber()) {
                // toastr.success('Valid');
            } else {
                errorCode = iti.getValidationError();
                $('#phoneLoginForm').find('.form-line')[1].style.marginTop = '25px';
                $.validator.messages.phone_check_login = errorMap[errorCode];
            }
        } else {
            errorCode = 5;
            $('#phoneLoginForm').find('.form-line')[1].style.marginTop = '25px';
            $.validator.messages.phone_check_login = errorMap[errorCode];
        }

        return iti.isValidNumber();
    });

    $.validator.addMethod("phone_check_register", function (value, element) {
        if (input.value.trim()) {
            if (iti.isValidNumber()) {

            } else {
                errorCode = iti.getValidationError();
                $('#phoneRegisterForm').find('.form-line')[1].style.marginTop = '25px';
                $.validator.messages.phone_check_register = errorMap[errorCode];
            }
        } else {
            errorCode = 5;
            $('#phoneRegisterForm').find('.form-line')[1].style.marginTop = '25px';
            $.validator.messages.phone_check_register = errorMap[errorCode];
        }

        return iti.isValidNumber();
    });
}

$('#phone').on('keypress', function (event) {
    var theEvent = window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\-|\ /;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
});

var lang;
const localization = {
    'en': {
        'copy': 'Copied',
        'mnemonic': 'Mnemonic is correct.',
        'otp': 'Please enter OTP.',
        'enable': 'Enable 2-step successfully.',
        'disable': 'Disable 2-step successfully.',
        'change_password': 'Changed password successfully.',
        'change_email': 'Changed email successfully, please verify it.',
    },
    'jp': {
        'copy': 'コピーしました。',
        'mnemonic': 'Mnemonicは正しいです。',
        'otp': 'OTPを入力してください。',
        'enable': '2ステップを正常に有効にします。',
        'disable': 'Disable 2-step successfully.',
        'change_password': 'パスワードを正常に変更しました。',
        'change_email': 'メールを正常に変更しました。確認してください。',
    },
    'vi': {
        'copy': 'Copied',
        'mnemonic': 'Mnemonic is correct.',
        'otp': 'Please enter OTP.',
        'enable': 'Enable 2-step successfully.',
        'disable': 'Disable 2-step successfully.',
        'change_password': 'Changed password successfully.',
        'change_email': 'Changed email successfully, please verify it.',
    },
    'il': {
        'copy': 'Copied',
        'mnemonic': 'Mnemonic is correct.',
        'otp': 'Please enter OTP.',
        'enable': 'Enable 2-step successfully.',
        'disable': 'Disable 2-step successfully.',
        'change_password': 'Changed password successfully.',
        'change_email': 'Changed email successfully, please verify it.',
    },
    'ta': {
        'copy': 'Copied',
        'mnemonic': 'Mnemonic is correct.',
        'otp': 'Please enter OTP.',
        'enable': 'Enable 2-step successfully.',
        'disable': 'Disable 2-step successfully.',
        'change_password': 'Changed password successfully.',
        'change_email': 'Changed email successfully, please verify it.',
    },
};

(function () {
    lang = $('html').attr('lang');
})(jQuery);

function copyToClipboard(element) {
    var copyText = document.getElementById(element);
    copyText.select();
    document.execCommand("copy");
    toastr.success(localization[lang].copy, '', 10000);
}

function updateBalance() {
    let totalBalance = 0;
    $.ajax({
        url: '/wallet/total-balance',
        method: "GET",
        success: function (data) {
            $('.select-total-balance #ETH').html(`ETH: ${data.totalBalances.currency_symbol}${data.totalBalances.ETH.value.toString()}`);
            $('.select-total-balance #MGC').html(`MGC: ${data.totalBalances.currency_symbol}${data.totalBalances.MGC.value.toString()}`);
        },
    });
    return totalBalance;
}

function getLocalCurrency() {
    $.ajax({
        url: '/wallet/local-currency',
        method: "GET",
        success: function (currency) {
            $('.pin-received').text(currency);
        },
    })
}

function saveKey(publicKey, key) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    localStorage.privateKey = encrypt.encrypt(key);
}

function saveMnemonic(publicKey, mnemonic) {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    localStorage.mnemonic = encrypt.encrypt(mnemonic);
}

function decryptKey(privateKey) {
    var decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    return decrypt.decrypt(localStorage.privateKey);
}

function decryptMnemonic(privateKey) {
    var decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    return decrypt.decrypt(localStorage.mnemonic);
}


WalletService.sendTransaction = (coin, sendAddress, receiveAddress, privateKey, amount, fee) => {
    switch (coin.toLowerCase()) {
        case 'eth':
            return EthService.sendTransaction(sendAddress, receiveAddress, privateKey, amount, fee);
        default:
            coin = coin.toLowerCase();
            if (_.includes(erc20Symbols, coin)) {
                return Erc20Service.sendTransaction(sendAddress, receiveAddress, privateKey, amount, fee, coin);
            }
            return 9999;
    }
};

EthService.sendTransaction = async (sendAddress, receiveAddress, privateKey, amount, fee) => {
    try {
        const wallet = new ethers.Wallet(privateKey, new ethers.providers.EtherscanProvider(EthService.network));
        const nonce = await wallet.getTransactionCount();
        let transactionInfo = {
            nonce: nonce,
            gasLimit: 21000,
            gasPrice: ethers.utils.parseUnits(fee.toString(), 'gwei'),
            to: receiveAddress,
            value: web3.toHex(web3.toWei(amount.toString(), 'ether')),
        }
        const transaction = await wallet.sendTransaction(transactionInfo);
        transaction.transactionUrl = EthService.broadcastTransactionUrl + '/tx/' + transaction.hash;
        toastr.success('Send coin pending');
        setTimeout(function () {
            location.reload();
        }, 2000)
    } catch (e) {
        console.log(e);
        toastr.error('Send coin fail');
        setTimeout(function () {
            location.reload();
        }, 2000)
    }

};

$('#amount').keyup(async function () {
    var currency = $('#currency_send_coin').val();
    const selectedCoin = currency.toUpperCase();
    const res = await WalletService.getCoinPrice(selectedCoin);
    const typeCoinConvert = $(".pin-received").text();
    let convertPrice = 0;
    switch (typeCoinConvert) {
        case 'USD':
            convertPrice = $('#amount').val() * res.priceUSD;
            break;
        case 'PHP':
            convertPrice = $('#amount').val() * res.pricePHP;
            break;
        case 'JPY':
            convertPrice = $('#amount').val() * res.priceJPY;
            break;
        default:
            break;
    }
    $('.pin-received').text(typeCoinConvert);
    $('#convert').val(convertPrice);
});


$(sendCoinForm).validate({
    rules: {
        currency: {
            required: true,
        },
        address: {
            required: true,
            is_eth_address: true,
        },
        amount: {
            required: true,
        },
    }
});

$(sendCoinForm).submit(async function (e) {
        e.preventDefault();
        if ($(sendCoinForm).valid()) {
            $(sendCoin).modal('hide');
            let coin = $('#currency_send_coin').val();
            const sendAddress = $('#sendAddress').val();
            const address = $('#address').val();
            const amount = $('#amount').val();
            const fee = $('#fee').val();

            const privateKeyRoute = '#privateKeyRoute';
            const url = $(privateKeyRoute).val();
            let balance = 0;
            if (coin === 'eth') {
                balance = await EthService.getAddressBalance(coin, sendAddress);
            } else {
                coin = mgcCoin;
                balance = await Erc20Service.getAddressBalance(coin, sendAddress);
            }
            if (parseFloat(balance) < parseFloat(amount)) {
                toastr.error('Amount so big');
            } else {
                $.ajax({
                    url: url,
                    method: 'GET',
                    success: function (data) {
                        const privateKey = decryptKey(data);
                        if (!privateKey) {
                            toastr.error('Can not get privateKey');
                        } else {
                            const send = WalletService.sendTransaction(
                                coin,
                                sendAddress,
                                address,
                                privateKey,
                                amount,
                                fee);
                        }

                    },
                });
            }
        }
    }
);

EthService.getApiUrl = () => {
    let ApiUrl = '';

    switch (EthService.network) {
        case 'mainnet':
            ApiUrl = 'https://api.etherscan.io';
            break;
        case 'ropsten':
            ApiUrl = 'https://api-ropsten.etherscan.io';
            break;
        default:
            ApiUrl = 'https://ropsten.etherscan.io';
    }
    return ApiUrl;
};

EthService.getAddressBalance = async (coin, address) => {
    const ApiUrl = EthService.getApiUrl();
    const url = `${ApiUrl}/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`;
    const response = await axios.get(url);
    const balance = response.data.result;
    return web3.fromWei(balance, 'ether');
};

/**
 * mango
 */



Erc20Service.getAddressBalance = async (coin, address) => {
    const ApiUrl = Erc20Service.getApiUrl();
    const contractAddress = Erc20Service.tokens[coin].address;
    try {
        const url = `${ApiUrl}/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=YourApiKeyToken`;
        const response = await axios.get(url);
        const balance = response.data.result;

        return balance / (10 ** Erc20Service.tokens[coin].decimal);
    } catch (error) {
        toastr.error('Get address balance fail');
        // toastr.error(ERROR_TYPES.REQUEST_FAILED);
        throw new Error(ERROR_TYPES.REQUEST_FAILED);
    }
};

Erc20Service.getApiUrl = () => {
    let ApiUrl = '';

    switch (Erc20Service.network) {
        case 'mainnet':
            ApiUrl = 'https://api.etherscan.io';
            break;
        case 'ropsten':
            ApiUrl = 'https://api-ropsten.etherscan.io';
            break;
        default:
            ApiUrl = 'https://ropsten.etherscan.io';
    }
    return ApiUrl;
};

Erc20Service.getContractABI = async (contractAddress) => {
    try {
        const url = `${ApiUrl}/api?module=contract&action=getabi&address=${contractAddress}&apikey=YourApiKeyToken`;
        const response = await axios.get(url);

        if (response.data.status === '0') {
            toastr.error(response.data.message);
            throw new Error(response.data.message);
        }
        return response.data.result;
    } catch (error) {
        return Erc20ABI;
    }
};

Erc20Service.sendTransaction = async (sendAddress, receiveAddress, privateKey, amount, fee, coin) => {
    try {
        const options = {
            gasLimit: 1000000,
            gasPrice: ethers.utils.parseUnits(`${fee}`, 'gwei'),
        };
        const wallet = new ethers.Wallet(privateKey, new ethers.providers.EtherscanProvider(Erc20Service.network));
        coin = coin.toLowerCase();
        const contractAddress = Erc20Service.tokens[coin].address;
        const contractAbiFragment = await Erc20Service.getContractABI(contractAddress);
        const contract = new ethers.Contract(contractAddress, contractAbiFragment, new ethers.providers.EtherscanProvider(Erc20Service.network));
        const contractWithSigner = contract.connect(wallet);
        const decimals = Erc20Service.tokens[coin].decimal;
        const numberOfTokens = ethers.utils.parseUnits(amount.toString(), decimals);
        const transaction = await contractWithSigner.transfer(receiveAddress, numberOfTokens, options);
        toastr.success('Send coin pending');
        setTimeout(function () {
            location.reload();
        }, 2000)
    } catch (error) {
        toastr.error('Send coin fail');
        console.log(error);
        setTimeout(function () {
            location.reload();
        }, 2000)
    }
};

//Select currency
$('.item_send_coin').click(function () {
    var currency = $(this).attr('data-currency');
    var type = $(this).attr('data-type');
    selectedCurrency(currency, type);
});
$('.item_request_address').click(function () {
    var currency = $(this).attr('data-currency');
    var type = $(this).attr('data-type');
    selectedCurrency(currency, type);
});

function getPopupRequestAddress(currency) {
    selectedCurrency(currency, ACTION_BY_REQUEST_ADDRESS);
    toggleSub();
}

function selectedCurrency(currency, type) {
    $('#currency_' + type).val(currency);
    $("#selected_" + type).html(renderSelectedUI(currency));
    setPlaceholderAmount(currency);
    setValueTransferZero();
    toggleSub();
}

function setValueTransferZero() {
    $('.control-pin #convert').val('');
    $('.control-pin #amount').val('');
}

function renderSelectedUI(currency) {
    return '<img src="/wallet-web/images/coins/' + currency + '.png" class="img-coin"><span class="name">' + getCurrencyName(currency) + '</span>';
}

function setPlaceholderAmount(string) {
    $('.pin-transfer').text(string.toUpperCase());
}

function getCurrencyName(currency) {
    if (currency == 'eth') {
        return 'Ether';
    } else if (currency == 'mgc') {
        return 'MangoCoin';
    }
    return '';
}

$('#toggleSub').click(function () {
    toggleSub();
});

function toggleSub() {
    $(".sub-special").toggle();
}

function setCurrencyDefault(currency) {
    selectedCurrency(currency, ACTION_BY_SEND_COIN);
    selectedCurrency(currency, ACTION_BY_REQUEST_ADDRESS);
    setPlaceholderAmount(currency);
}

//Open submenu setting
$(document).ready(function () {
    var pathname = window.location.pathname;
    if (pathname.indexOf("setting") > -1) {
        $('.setting-list').css("display", "block");
    }
    setCurrencyDefault('mgc');
    if (pathname.indexOf("transaction/eth") > -1) {
        setCurrencyDefault('eth');
    }
    if (pathname.indexOf("transaction/mango") > -1) {
        setCurrencyDefault('mgc');
    }
});

//Get fee
$('#fee').click(function () {
    getFee();
});

$('#header-content').click(function () {
    getFee();
});

async function getFee() {
    const response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let data = {
        slowly: response.data.safeLow / 10,
        regular: response.data.average / 10,
        fast: response.data.fast / 10,
    };
    $('#sendCoin').find('option')[0].value = data.slowly;
    $('#sendCoin').find('option')[1].value = data.regular;
    $('#sendCoin').find('option')[2].value = data.fast;

    $('#sendCoin').find('.show-fee').find('span')[0].innerText = $('#fee').val();
}

function showMnemonicAfterRegister() {
    const url = $(privateKeyRoute).val();
    $.ajax({
        url: url,
        method: 'GET',
        success: function (privateKey) {
            const mnemonic = decryptMnemonic(privateKey);
            $('#mnemonicTxt').val(mnemonic);
            $('#qrCoeRecovery').html('').qrcode({
                size: '200',
                render: 'image',
                text: mnemonic
            });
            $('#backupPhrase').modal('show');
        }
    })
}

function phoneValidate(phone = "#phone", full_phone = "full_phone") {
    var input = document.querySelector(phone);
    // window.intlTelInput(input);

    // here, the index maps to the error code returned from getValidationError - see readme
    // var errorMap = [ "Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
    var errorMap = [ "Invalid number", "Invalid country code", "Invalid number", "Invalid number", "Invalid number"];

    // initialise plugin
    var iti = window.intlTelInput(input, {
        hiddenInput: full_phone,
        utilsScript: "/intl-tel/build/js/utils.js"
    });

    // on blur: validate
    input.addEventListener('blur', function() {
        if (input.value.trim()) {
            if (iti.isValidNumber()) {
                // toastr.success('Valid');
            } else {
                var errorCode = iti.getValidationError();
                toastr.error(errorMap[errorCode]);
            }
        }
    });
}

$(sendCoin).find('#amount').on('keypress', function () {
    var val = this.value.split('.');
    if (val[1] && val[1].length == 8) {
        return false;
    }
});
