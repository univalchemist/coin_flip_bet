import { useCallback, useEffect, useState } from 'react';
import {useMoralis} from 'react-moralis'; 
import { ContractAddress } from './constant';
import ContracABI from "./contract/ContractABI.json"

import './App.css';

function App() {
  const { Moralis } = useMoralis();
  const [betAmount, setBetamount] = useState(0);
  const [betOption, setBetOption] = useState(0);

  const handlePlaceBet = useCallback(async () => {
    try {
      const toWei = Moralis.Units.ETH(betAmount)
      const options = {
        contractAddress: ContractAddress,
        abi: ContracABI,
        functionName: "placeBet",
        params: {
          option: betOption
        },
        msgValue: toWei,
      }
      const transaction = await Moralis.executeFunction(options)
      const receipt = await transaction.wait()
      console.log("place bet receipt: ", receipt)
      if (receipt && receipt.status === 1) {
        window.alert("Placing bet is success. Try again")
        setBetOption(0)
        setBetamount(0)
      } else {
        window.alert("Placing bet is failed. Try again")
      }
    } catch (error) {
      console.log("place bet error: ", error)
      window.alert("Placing bet is failed. Try again")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betAmount, betOption])

  useEffect(() => {
    if(!Moralis.enableWeb3()){
      Moralis.authenticate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">
      <div className="App-content">
        <p>
           Place a bet and Get reward by winning on CoinFlip
        </p>
        <div className="bet-container">
          <input placeholder='ETH to bet' type="number" value={betAmount} onChange={e => setBetamount(e.target.value)} />
          <select value={betOption} onChange={e => setBetOption(e.target.value)}>
            <option value={0}>HEAD</option>
            <option value={1}>TAIL</option>
          </select>
          <button disabled={betAmount <= 0} onClick={handlePlaceBet}>Place a bet</button>
        </div>
      </div>
    </div>
  );
}

export default App;
