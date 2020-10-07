const fs = require('fs');
const path = require('path');
const Web3 = require('web3');


/**
 * 7995fe2b9bf2133a7dae0892b11d9232b8cd9c892a833999bcd29da58fbb5d26
 */

const NODE_ADDRESS = process.argv[2];
const PRIVATE_KEY = process.argv[2];
const CONTRACT_NAME = process.argv[3];
const CONTRACT_ARGS = process.argv.slice(4);

const scan = async (message) => {
    process.stdout.write(message);
    return await new Promise((resolve, reject) => {
        process.stdin.resume();
        process.stdin.once('data', (data) => {
            process.stdin.pause();
            resolve(data.toString().trim());
        });
    });
};

const getGasPrice = async (web3) => {
    while (true) {
        const nodeGasPrice = await web3.eth.getGasPrice();
        const userGasPrice = await scan(`Enter gas-price or leave empty to use ${nodeGasPrice}: `);
        if (/^\d+$/.test(userGasPrice)) {
            return userGasPrice;
        }
        if (userGasPrice === '') {
            return nodeGasPrice;
        }
        console.log('Illegal gas-price');
    }
};

const getTransactionReceipt = async (web3) => {
    while (true) {
        const hash = await scan('Enter transaction-hash or leave empty to retry: ');
        if (/^0x([0-9A-Fa-f]{64})$/.test(hash)) {
            const receipt = await web3.eth.getTransactionReceipt(hash);
            if (receipt) {
                return receipt;
            }
            console.log('Invalid transaction-hash');
        }
        else if (hash) {
            console.log('Illegal transaction-hash');
        }
        else {
            return null;
        }
    }
};

const send = async (web3, account, transaction) => {
    while (true) {
        try {
            const options = {
                data: transaction.encodeABI(),
                gas: 607020,
                gasPrice: await getGasPrice(web3)
            };
            const signed = await web3.eth.accounts.signTransaction(options, account.privateKey);
            const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            return receipt;
        }
        catch (error) {
            console.log(error.message);
            const receipt = await getTransactionReceipt(web3);
            if (receipt) {
                return receipt;
            }
        }
    }
};

const run = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/93616cb33aae4439b46feffabb99a91d"));
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    const contractPath = path.resolve(__dirname, '../solidity/build', CONTRACT_NAME);
    const abi = fs.readFileSync(contractPath + '.abi', {
        encoding: 'utf8'
    });
    const bin = fs.readFileSync(contractPath + '.bin', {
        encoding: 'utf8'
    });
    const contract = new web3.eth.Contract(JSON.parse(abi));
    const options = {
        data: '0x' + bin, arguments: CONTRACT_ARGS
    };
    const transaction = contract.deploy(options);
    const receipt = await send(web3, account, transaction);
    console.log(JSON.stringify({
        [CONTRACT_NAME]: {
            name: CONTRACT_NAME,
            addr: receipt.contractAddress,
            args: transaction.encodeABI().slice(options.data.length)
        }
    }));
    web3.currentProvider.disconnect();
};

run();
