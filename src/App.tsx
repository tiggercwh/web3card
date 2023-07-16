import { useEffect, useState } from "react";
import { ethers, EnsResolver } from "ethers";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./App.css";
import { formatBalance, formatChainAsNum } from "@/lib/utils";
import type { JsonRpcSigner } from "ethers";
import Web3Card from "@/lib/content/Web3Card";

/*
Need to show:
connected chain ID, ENS(Ethereum Name Service) and ENS avatar(if there are any), 
Ethereum wallet address, and the remaining balance of Ethereum.
*/

function App() {
  return (
    <div className="flex justify-center items-center h-full w-full bg-black">
      <div className="flex items-center justify-center w-3/5 bg-black">
        <Web3Card
          cardTitle="My Web3 Profile"
          cardDescription="Don't ask me why but avatar still does not work!"
          customCardStyle={{ backgroundColor: "pink" }}
        />
      </div>
    </div>
  );
}

export default App;
