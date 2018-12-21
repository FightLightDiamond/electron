const bitcoin = require('bitcoinjs-lib');
let testnet = bitcoin.networks.testnet;
const network = {network: testnet};
const {btc} = require('../Models/BTC');
const AbstractService = require('./AbstractService');
const bnet =  require('../config/btc/network');
const bip39 = require('bip39');
const bip32 = require('bip32');

class BtcService extends AbstractService {
    constructor() {
        super();
        this.db = btc;
    }

    create() {
        // const keyPair = bitcoin.ECPair.makeRandom(network);
        // const {address} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey, network: testnet });
        // let private_key = keyPair.toWIF();
        //
        // const data = {
        //     address: address,
        //     private_key: private_key,
        //     created_at: this.now()
        // };
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeed(mnemonic);
        const master = bip32.fromSeed(seed);
        const dp = master.derivePath("m/140'/0'/0'/0/5");
        const address = bitcoin.payments.p2pkh({ pubkey: dp.publicKey, network: testnet }).address;
        const wif = dp.toWIF();
        const data = {
            mnemonic: mnemonic,
            address: address,
            private_key: wif,
            create_at: this.now()
        };

        btc.insert(data);
        return data;
    }

    async sends(_id, toAddress, amount = 10000, fee = 2000) {
        const satoshis = parseFloat(amount) * Math.pow(10, 8);
        let wallet = await btc.get({_id: _id});

        const fromAddress = wallet[0].address;
        const WIF = wallet[0].private_key;

        let txb = new bitcoin.TransactionBuilder(testnet);

        let current = 0;
        let utxos = await this.getUxtos(fromAddress);

        for (const utx of utxos) {
            txb.addInput(utx.tx_hash_big_endian, utx.tx_output_n);
            current += utx.value;
            if (current >= (satoshis + fee)) break;
        }

        txb.addOutput(toAddress, satoshis);
        const change = current - (satoshis + fee);

        if (change) {
            txb.addOutput(fromAddress, change);
        }
        let keyPairSpend = bitcoin.ECPair.fromWIF(WIF, testnet);
        txb.sign(0, keyPairSpend);
        const raw = txb.build().toHex();
        console.log(raw);
        const result = await bnet.api.broadcast(raw);
        console.log(result);
        return result;
    }

    async getUxtos(fromAddress) {
        const Unspent = await blockexplorer.getUnspentOutputs(fromAddress);
        return (Unspent.unspent_outputs);
    }

    async get(filter = {}, select = {}) {
        return await btc.get(filter, select);
    }

    model() {
        return btc.model();
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
