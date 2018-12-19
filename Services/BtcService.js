const bitcoin = require('bitcoinjs-lib');
let testnet = bitcoin.networks.testnet;
const network = {network: testnet};
const {btc} = require('../Models/BTC');
const AbstractService = require('./AbstractService');

class BtcService extends AbstractService {

    constructor() {
        super();
        this.db = btc;
    }

    create() {
        const keyPair = bitcoin.ECPair.makeRandom(network);
        const {address} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey, network: testnet });
        let private_key = keyPair.toWIF();

        const data = {
            address: address,
            private_key: private_key,
            created_at: this.now()
        };
        btc.insert(data);
        return data;
    }

    sends(fromAddress, toAddress, amount) {
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

    async get(filter = {}, select = {}) {
        return await btc.get(filter, select);
    }

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
}

let btcService = new BtcService();

module.exports = btcService;
