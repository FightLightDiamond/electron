const ethers = require('ethers');
// var Web3 = require('web3');
// var web3 = new Web3(Web3.givenProvider);
// const BigNumber = require('bignumber.js');
// BigNumber.config({ DECIMAL_PLACES: 16 })

module.exports = {
    async gasPriceDefault() {
        let provider = ethers.getDefaultProvider();
        return await provider.getGasPrice();
    },

    async ballance(wallet) {
        return await wallet.getBalance();
    },

    async send(wallet, gasLimit, gasPrice, newAddress, value) {
        let tx = await wallet.sendTransaction({
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            to: newAddress,
            value: value
        });
        return tx;
    },

    async sweep(privateKey, newAddress) {

        let provider = ethers.getDefaultProvider();

        let wallet = new ethers.Wallet(privateKey, provider);

        // Make sure we are sweeping to an EOA, not a contract. The gas required
        // to send to a contract cannot be certain, so we may leave dust behind
        // or not set a high enough gas limit, in which case the transaction will
        // fail.
        let code = await provider.getCode(newAddress);
        if (code !== '0x') {
            throw new Error('Cannot sweep to a contract');
        }

        // Get the current balance
        let balance = await wallet.getBalance();

        // Normally we would let the Wallet populate this for us, but we
        // need to compute EXACTLY how much value to send
        let gasPrice = await provider.getGasPrice();

        // The exact cost (in gas) to send to an Externally Owned Account (EOA)
        let gasLimit = 21000;

        // The balance less exactly the txfee in wei
        let value = balance.sub(gasPrice.mul(gasLimit))

        let tx = await wallet.sendTransaction({
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            to: newAddress,
            value: value
        });

        console.log('Sent in Transaction: ' + tx.hash);
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
           // value: new BigNumber(0.1 * Math.pow(10, 18)).toNumber(),
            value: ethers.utils.parseEther(value.toString()),
        };

        let balance = await wallet.getBalance();
        console.log('balance', balance);

        // Normally we would let the Wallet populate this for us, but we
        // need to compute EXACTLY how much value to send
        let gasPrice = await provider.getGasPrice();
        console.log('gasPrice', gasPrice);

        // The exact cost (in gas) to send to an Externally Owned Account (EOA)
        let gasLimit = 21000;

        // The balance less exactly the txfee in wei
        // let value = balance.sub(gasPrice.mul(gasLimit))


        const transactionInfoction = await wallet.sendTransaction(transactionInfo);

        // console.log(transaction);
    }
};