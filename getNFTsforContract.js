const { Alchemy, Network } = require("alchemy-sdk");
const fs = require("fs");
require("dotenv").config();

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

/**
 * A function to get all the NFTs for a given contract address and save it to a JSON file
 *
 * @param {*} contractAddress Contract Address of the NFT Collection
 * @param {*} collectionName Name of the NFT Collection
 * @param {*} pageKey Pagination Key , default sets to null
 */
async function getNFTsforContract(contractAddress, collectionName, pageKey) {
  console.log("before", pageKey);
  let nfts = await alchemy.nft.getNftsForContract(
    contractAddress,
    (options = {
      pageKey: pageKey,
    })
  );
  let pagination = nfts["pageKey"];
  console.log("after", pagination);
  nfts = nfts["nfts"];
  collectionData = [];
  for (let i = 0; i < nfts.length; i++) {
    collectionData.push({
      tokenId: nfts[i].tokenId,
      title: nfts[i].title,
      description: nfts[i].description,
      image: nfts[i]["rawMetadata"]["image"],
      edition: nfts[i]["rawMetadata"]["edition"],
      openSeaLink:
        "https://opensea.io/assets/ethereum/" +
        contractAddress +
        "/" +
        nfts[i].tokenId,
    });
  }
  jsonData = JSON.stringify(collectionData);
  fs.appendFile(`${collectionName}.json`, jsonData, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
  if (pagination != null) {
    getNFTsforContract(
      (contractAddress = contractAddress),
      `${collectionName}`,
      (pageKey = pagination)
    );
  }
}

module.exports = getNFTsforContract;
// async function saveContractData()

