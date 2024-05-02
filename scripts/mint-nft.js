// Carica le variabili di ambiente dal file .env
require("dotenv").config()

// Imposta il provider Web3
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(process.env.API_URL)

// Imposta lo smart contract
const contract = require(process.env.CONTRACT_ABI_PATH)
// Definizione dell'indirizzo del contratto nella blockchain
const contractAddress = process.env.CONTRACT_ADDRESS
// Creazione di una nuova istanza del contratto
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

// Funzione per il conio di un nuovo NFT
async function mintNFT(tokenURI) {
  // Ottieni l'ultimo nonce. Tenerne traccia serve per motivi di sicurezza (evitare attacchi di riproduzione)
  const nonce = await web3.eth.getTransactionCount(process.env.PUBLIC_KEY, "latest") 

  // Costruisci l'oggetto transazione
  const tx = {
    from: process.env.PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(process.env.PUBLIC_KEY, tokenURI).encodeABI()
  }

  // Firma la transazione
  const signPromise = web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY)

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
}

// Minta l'NFT
mintNFT(process.env.IPFS)