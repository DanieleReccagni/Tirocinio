// Carica le variabili di ambiente dal file .env
require("dotenv").config()

// Imposta il provider Web3
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(process.env.API_URL)

// Imposta gli account mittente e destinatario
const accountFrom = process.env.PUBLIC_KEY;
const accountTo = process.env.RECEIVER_KEY;

// Imposta lo smart contract e l'ID dell'NFT da trasferire
const nftContractAddress = process.env.CONTRACT_ADDRESS;
const contract = require(process.env.CONTRACT_ABI_PATH)
const nftContract = new web3.eth.Contract(contract.abi, nftContractAddress);
const nftId = 1;

// Ottieni la chiave privata dell'account mittente
const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex');

// Costruisci la transazione per il trasferimento dell'NFT
const transferTx = nftContract.methods.safeTransferFrom(accountFrom, accountTo, nftId);
const encodedTx = transferTx.encodeABI();

// Ottieni il nonce dell'account mittente
web3.eth.getTransactionCount(accountFrom, (err, nonce) => {
    if (err) {
        console.error('Errore nel recuperare il nonce:', err);
        return;
    }

    // Costruisci l'oggetto transazione
    const txObject = {
        nonce: nonce,
        gasLimit: web3.utils.toHex(500000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
        to: nftContractAddress,
        data: encodedTx
    };

    // Firma la transazione
    const signPromise = web3.eth.accounts.signTransaction(txObject, process.env.PRIVATE_KEY)

    // Invia la transazione alla blockchain
    signPromise
      .then((signedTx) => {
        // Restituisce l'hash della transazione
        web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              console.log("L'hash della transazione è:", hash)
            } else {
              console.log("Qualcosa è andato storto con la tua transazione:", err)
            }
          }
        )
      })
      .catch((err) => {
        console.log("Promise fallita:", err)
      })
});