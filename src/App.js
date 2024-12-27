import React,{ Component, useState, useEffect } from 'react'
import { ethers, BrowserProvider } from "ethers";
import './App.css';
import { providers } from 'ethers/providers';
import HelloAbi from './contractsData/Hello.json'
import HelloAddress from './contractsData/Hello-address.json'


function App() {   
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Connect to Ethereum
    const initialize = async () => {
      //if (window.ethereum) {
       // const web3Provider = new BrowserProvider("http://ec2-34-221-100-136.us-west-2.compute.amazonaws.com:8545");
        
	const web3Provider = new ethers.JsonRpcProvider("http://ec2-34-221-100-136.us-west-2.compute.amazonaws.com:8545");


	setProvider(web3Provider);

        const signer = await web3Provider.getSigner(0);
        setSigner(signer);
        console.log("HelloAddress", HelloAddress.address)
	console.log("HelloAbi", HelloAbi)
        console.log("signer", signer)
        const helloWorldContract = new ethers.Contract(HelloAddress.address, HelloAbi.abi, signer); //web3Provider); //signer);
        setContract(helloWorldContract);
      //} else {
       // alert("MetaMask is required to use this DApp");
      //}
    };

    initialize();
  }, [HelloAddress, HelloAbi]);

  const fetchMessage = async () => {
    if (contract) {
      const currentMessage = await contract.get();
      setMessage(currentMessage);
    }
  };

  const updateMessage = async () => {
    if (contract && newMessage) {
      const tx = await contract.set(newMessage);
      await tx.wait();
      setNewMessage("");
      fetchMessage(); // Refresh message after updating
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Hello World DApp</h1>
      <p>
        <strong>Current Message:</strong> {message || "Loading..."}
      </p>
      <button onClick={fetchMessage}>Fetch Message</button>
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="New Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={updateMessage}>Update Message</button>
      </div>
    </div>
  );
};

export default App;

