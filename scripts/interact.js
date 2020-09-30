const Xdc3 = require("web3");
const path = require("path");
const fs = require("fs");

const xdc3 = new Xdc3(
  new Xdc3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/93616cb33aae4439b46feffabb99a91d"
  )
);

const CONTRACT_NAME = process.argv[2];
const CONTRACT_ADDRESS = process.argv[3];

console.log(CONTRACT_NAME, CONTRACT_ADDRESS);

const ABI = [
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_contractName",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_contractAddress",
        type: "address",
      },
    ],
    name: "AddressUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_prevOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "OwnerUpdate",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_contractName",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_contractAddress",
        type: "address",
      },
    ],
    name: "registerAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_contractName",
        type: "bytes32",
      },
    ],
    name: "unregisterAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_contractName",
        type: "bytes32",
      },
    ],
    name: "addressOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "contractNames",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_contractName",
        type: "bytes32",
      },
    ],
    name: "getAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "itemCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "newOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contract = new xdc3.eth.Contract(
  JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../solidity/build", `${CONTRACT_NAME}.abi`),
      { encoding: "utf-8" }
    )
  ),
  CONTRACT_ADDRESS
);

contract.methods
  .itemCount()
  .call()
  .then((resp) => {
    console.log("response", resp);
  })
  .catch((e) => {
    console.log(e);
  });
