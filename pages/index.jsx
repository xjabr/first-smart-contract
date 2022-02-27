import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { contractaddress } from '../config';
import WorkContract from '../artifacts/contracts/WorkContract.sol/WorkContract.json';

let rpcEndpoint = null;

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL;
}

const Index = () => {
  const [contract, setContract] = useState(null);
  const [addressAgency, setAddressAgency] = useState(null);
  const [addressCustomer, setAddressCustomer] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractaddress, WorkContract.abi, signer);
      
      // create fake wallet
      const mnemonic = "announce room limb pattern dry unit scale effort smooth jazz weasel alcohol"
      let walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)
      const walletPrivateKey = new ethers.Wallet(walletMnemonic.privateKey)
      
      setContract(contract);
      setAddressAgency(await signer.getAddress());
      setAddressCustomer(await walletPrivateKey.getAddress());
    };

    const fetchData = async () => {
      if (contract === null) return ;
      const data = await contract.getAllItems();
      setItems(data);
    }

    init();
    fetchData();
  }, [refresh]);

  const handleAddContract = async () => {
    const res = await contract.addContract(addressCustomer);
    await res.wait();
    setRefresh(x => x+1);
  };

  const handleSignContract = async (itemId) => {
    const res = await contract.signAContract(itemId); // todo remove
    await res.wait();
    setRefresh(x => x+1);
  };

  return (
    <div>
      <p>Agency: {addressAgency}</p>
      <p>Customer: {addressCustomer}</p>

      <hr />

      <p>List of contracts</p>
      <ul>
        {
          items.map((item, index) => {
            return (
              <li key={index}>
                <p>Item Id: {item.itemId._hex}</p>
                <p>From: {item.from}</p>
                <p>To: {item.to}</p>
                <p>Is Completed: {item.signed ? 'YES' : 'NO'}</p>
                { item.signed ? null : <button onClick={() => handleSignContract(item.itemId._hex)}>Complete</button> }
              </li>
            )
          })
        }
      </ul>

      <hr />

      <button onClick={() => handleAddContract()}>Add contract</button>
    </div>
  )
}

export default Index