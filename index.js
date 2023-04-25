import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
const ownerButton = document.getElementById("ownerButton");
const funderButton = document.getElementById("funderButton");
const addressFounderButton = document.getElementById("addressFounderButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
ownerButton.onclick = getOwner;
funderButton.onclick = getFunder;
addressFounderButton.onclick = getAddressFounder;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            connectButton.innerHTML = "Connected:)!";
            console.log(ethers);
        } catch (error) {
            console.log(error);
        }
    } else {
        connectButton.innerHTML = "Please install MetaMask!:)";
    }
}

async function fund() {
    //HARDCODED just for somplicity(ethAmount)
    const ethAmount = document.getElementById("ethAmount").value;

    console.log(`Funding with ${ethAmount} ...`);
    if (typeof window.ethereum !== "undefined") {
        //provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        //signer
        const signer = provider.getSigner();
        console.log(signer);

        //contract that we will interact with: ABI, Address
        //what we have is: ethers contract object, that is connected to our signer
        //and we have contractAddress, abi
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            //now we can create transaction like before
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            //wait for tx finish - it is a promise
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done!");
        } catch (error) {
            console.log(error);
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    //create listener for the blockchain
    //listen for this transaction to finish => listener is a anonymous function that is: () => {}
    return new Promise((resolve, reject) => {
        //it will be resolved once and only once when transactionResponse.hash is found(it is inside provider.once({}))
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            );
            resolve();
        });
    });
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

//withdraw function
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider);
            // await transactionResponse.wait(1)
        } catch (error) {
            console.log(error);
        }
    }
}

async function getOwner() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const thisOwner = await contract.getOwner();
        console.log(`Owner: ${thisOwner}`);
    }
}

async function getFunder() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const thisFunder = await contract.getFunder(0);
        console.log(`Funder: ${thisFunder}`);
    }
}

async function getAddressFounder() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        var fouunderAddress = await contract.getFunder(0);
        const thisFunder = await contract.getAddressToAmountFunded(
            fouunderAddress
        );
        console.log(`AddressToAmountFunded: ${thisFunder}`);
    }
}
