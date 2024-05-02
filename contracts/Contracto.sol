// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721]
// SPDX-License-Identifier: MIT

// Versione di Solidity utilizzata
pragma solidity ^0.8.21;

// Per creare un NFT valido, lo smart contract deve implementare tutti i metodi dell'interfaccia definita dallo standard ERC-721
// Questo file contiene un'implementazione di essi
// E' importata anche un'estensione per permettere l'utilizzo del tokenURI (vedi dopo)
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Ogni NFT coniato dallo smart contract deve avere un ID univoco
// In questo caso questo ID sarà il numero totale di NFT coniati dal contract
// Questo file fornisce un contatore che può essere incrementato o decrementato di un'unità alla volta
import "@openzeppelin/contracts/utils/Counters.sol";

// Con questo import solo il proprietario dello smart contract può coniare NFT con esso
// E' facoltativo: se non si vuole questo vincolo, rimuovere Ownable e onlyOwner dal codice qui sotto
import "@openzeppelin/contracts/access/Ownable.sol";

// Definizione dello smart contract
contract Contract is ERC721URIStorage, Ownable {

    // Dichiarazione del contatore per gli ID
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Costruttore (nome del contratto, simbolo del contratto)
    // Il nome è quello che compare su MetaMask
    constructor() ERC721("Esempio", "NFT") {}

    // Funzione che permette di coniare un nuovo NFT da questo smart contract
    // recipient: indirizzo che riceverà l'NFT coniato
    // tokenURI: collegamento ad un file JSON che contiene i metadati dell'NFT coniato
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        // Incrementa il contatore
        _tokenIds.increment();

        // Conia il nuovo NFT
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        // Restituisce l'ID del nuovo NFT
        return newItemId;
    }
}