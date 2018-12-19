const ethers = require('ethers');
const {eth} = require('../Models/ETH');

module.exports = {
    async gasPriceDefault() {
        let provider = ethers.getDefaultProvider();
        return await provider.getGasPrice();
    },

    async balance(wallet) {
        return await wallet.getBalance();
    },

    async send(wallet, gasLimit, gasPrice, newAddress, value) {
        return await wallet.sendTransaction({
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            to: newAddress,
            value: value
        });
    },

    async sends(privateKey, receiveAddress, value = 0.1, fee = 100) {
        const EthService = {
            network: 'ropsten',
            providerUrl: 'http://ropsten.infura.io',
            broadcastTransactionUrl: 'https://ropsten.etherscan.io',
        };
        const provider = new ethers.providers.EtherscanProvider(EthService.network);
        const wallet = new ethers.Wallet(privateKey, provider);
        const nonce = await wallet.getTransactionCount();
        let transactionInfo = {
            nonce: nonce,
            gasLimit: 21000,
            gasPrice: ethers.utils.parseUnits(fee.toString(), 'gwei'),
            to: receiveAddress,
            value: ethers.utils.parseEther(value.toString()),
        };
        return await wallet.sendTransaction(transactionInfo);
    },

    async restore(mnemonic) {
        const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
        const count = await eth.model().count({mnemonic: mnemonic});
        if (count === 0) {
            return this.insert(wallet)
        }
        return null;
    },

    insert(wallet) {
        const wl = {
            address: wallet.signingKey.address,
            mnemonic: wallet.signingKey.mnemonic,
            private_key: wallet.signingKey.privateKey,
            created_at: this.now()
        };
        eth.insert(wl);
        return wl;
    },

    remove(data) {
        return eth.delete(data);
    },

    model() {
        return eth.model();
    },

    now() {
        const now = new Date();
        const year = "" + now.getFullYear();
        let month = "" + (now.getMonth() + 1);
        if (month.length === 1) {
            month = "0" + month;
        }
        let day = "" + now.getDate();
        if (day.length === 1) {
            day = "0" + day;
        }
        let hour = "" + now.getHours();
        if (hour.length === 1) {
            hour = "0" + hour;
        }
        let minute = "" + now.getMinutes();
        if (minute.length === 1) {
            minute = "0" + minute;
        }
        let second = "" + now.getSeconds();
        if (second.length === 1) {
            second = "0" + second;
        }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }
};
