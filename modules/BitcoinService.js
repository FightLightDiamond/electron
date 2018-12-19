const bitcoin = require('bitcoinjs-lib');
let testnet = bitcoin.networks.testnet;
const network = {network: testnet};

class BitcoinService {
    create() {
        const keyPair = bitcoin.ECPair.makeRandom(network);
        const {address} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey})
        let private_key = keyPair.toWIF();
        return {
            address: address,
            private_key: private_key
        }
    }

    send(fromAddress, toAddress, amount) {
        let txb = new bitcoin.TransactionBuilder(testnet);
        let outn = 0;

        //address from
        txb.addInput(fromAddress, outn);
        //address to
        txb.addOutput(toAddress, amount);

        let WIF = "private key";
        let keyPairSpend = bitcoin.ECPair.fromWIF(WIF, testnet);
        txb.sign(0, keyPairSpend);

        let tx = txb.build();
        let txhex = tx.toHex();
        console.log(txhex);
    }
}

let bitcoinService = new BitcoinService();

module.exports = bitcoinService;
