async function main() {

    // Crea un "fabbricatore di istanze" dello smart contract
    const MyNFT = await ethers.getContractFactory("Contract")
  
    // Crea una nuova istanza dello smart contract
    const myNFT = await MyNFT.deploy()
    await myNFT.deployed()
    console.log("Contratto distribuito all'indirizzo:", myNFT.address)
}
  
// Esecuzione di main e cattura errori
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
})