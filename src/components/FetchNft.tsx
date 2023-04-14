import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"
import { PublicKey } from "@solana/web3.js"

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
    const authoritykey =  new PublicKey("GCkKhzFSyAC35nArqwsvMBvLFnoXNWFAMjx3dsZh2GpV")
    const nfts = await (await metaplex
      .nfts()
      .findAllByOwner({ owner: wallet.publicKey })
      .run())
      // .filter((r) => r.updateAuthorityAddress === authoritykey)
  
    const nftsnew = nfts
    
    console.log(nfts) 

    let nftData = []
    let nftMints = [] 
  
    for (let i = 0; i < nfts.length; i++) {
      let fetchResult = await fetch(nfts[i].uri,{
        mode: 'no-cors',
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
  
      })
      let fetchMint = await  new PublicKey(nfts[i].address).toBase58()
      console.log(fetchMint)
      if (!fetchResult.ok) {
      let json = await fetchResult.json()
      // nftData.push(json)
      }

      nftMints.push(fetchMint)
    }

    setNftMints(nftMints)
    setNftData(nftData)
  }

  useEffect(() => {
    fetchNfts()
  }, [wallet])

  return (
    <div>
      {nftMints && nftData &&  (
        <div className={styles.gridNFT}>
          <div>
          {nftData.map((nft) => (
            
            <>
              <img src={nft.image} />
               <ul>{nft.properties.creators.share}</ul>
              <ul>{nft.name}</ul>
            </>
           
          ))}
          {nftMints.map((nftmint) => (
            <>
              <button onClick={handleClick} data-value-mint={nftmint}>STAKE</button> 
            </>
          ))}
          </div>
      
        </div>
        
      )}
    </div>
  )
}
