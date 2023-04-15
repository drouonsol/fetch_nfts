import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, findNftsByMintListOperation, walletAdapterIdentity } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"
import { PublicKey } from "@solana/web3.js"
import { Button } from "@chakra-ui/react"

export const FetchNft: FC = () => {
  const [nftData, setNftData] = useState(null)
  const [nftMints, setNftMints] = useState(null)

  const wallet = useWallet()
  const { connection } = useConnection()

  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

  function handleClick(this: any,event: any) {
    event.preventDefault()
    let data = event?.target.dataset;
    console.log(data.valueMint)
  }

  const fetchNfts = async () => {
    if (!wallet.connected) {
      return
    }

    const nfts = await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey })
      .run()

    let nftData = []
    let nftMints = [] 

    

    for (let i = 0; i < nfts.length; i++) {
      let fetchMint = await  new PublicKey(nfts[i].address).toBase58()



      let fetchResult = await fetch(nfts[i].uri, 
      //   {
      //      headers : { 
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json'
      // }
      //  }
       );
      

      let json = await fetchResult.json()
      let mergedarray = [json, fetchMint]
      nftData.push(mergedarray)
      console.log(mergedarray)
      

    }
    setNftMints(nftMints)
    setNftData(nftData)
  }

  useEffect(() => {
    fetchNfts()
  }, [wallet])


  let cards = 2


  return (
    <div>
      {nftData && nftMints &&
       (
        <div className={styles.gridNFT}>
   

            {nftData.map((nft) => (
              <div>
        
           
              <img src={nft[0].image} />
              <ul>{nft[0].name}</ul>
              <button onClick={handleClick} data-value-mint={nft[1]}>STAKE</button>
            </div>
            
          ))}      
        

    
        </div>
      )}
     
    
    </div>
  )
}
