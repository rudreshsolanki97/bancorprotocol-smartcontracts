const Xdc3 = require("xdc3");
const path = require("path");
const fs = require("fs");

const xdc3 = new Xdc3(
  new Xdc3.providers.HttpProvider("https://erpc.apothem.network")
);

const CONTRACT_NAME = process.argv[2];
const PRIVATE_KEY = process.argv[3];

console.log(CONTRACT_NAME);

const ABI_PATH = path.resolve("../solidity/build", `${CONTRACT_NAME}.abi`);
const BYTECODE_PATH = path.resolve("../solidity/build", `${CONTRACT_NAME}.bin`);

const account = xdc3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

const from = account.address;

const BYTECODE = "0x" + Obj.object;

const TxData = { data: BYTECODE };

// xdc3.eth
//   .estimateGas({
//     data: TxData.data,
//     from,
//   })
//   .then((fee) => {
// console.log(fee);
TxData["gasLimit"] = 5000000;
xdc3.eth.accounts.signTransaction(TxData, PRIVATE_KEY).then((signed) => {
  xdc3.eth
    .sendSignedTransaction(signed.rawTransaction)
    .once("transactionHash", (hash) => {
      console.log("hash", hash);
    })
    .once("receipt", (receipt) => {
      console.log("receipt", receipt);
    });
});
// })
// .catch((e) => {
//   console.log("error", e);
// });
