import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter as CardFooterBase,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useWalletData } from "../hooks/useWalletData";

type Web3CardProps = {
  cardTitle: string;
  cardDescription: string;
  customCardStyle: React.CSSProperties;
};

const Web3Card = ({
  cardTitle,
  cardDescription,
  customCardStyle,
}: Web3CardProps) => {
  // display limited content when provider doesn't exist

  const {
    provider,
    signer,
    wallet,
    avatar,
    handleConnect,
    disconnectWallet,
    disableConnect,
    publicKey,
    ENS,
    isConnecting,
    error,
    errorMessage,
    signedMessage,
    signDefaultMessage,
  } = useWalletData();

  const hasAccount = wallet.accounts.length > 0;

  const defaultContent = (
    <>
      {window.ethereum?.isMetaMask && (
        <Button disabled={disableConnect} onClick={handleConnect}>
          Connect your Wallet
        </Button>
      )}
    </>
  );

  const loggedInContent = (
    <>
      <Label>Wallet Address: {wallet.accounts[0]}</Label>
      <Label>Wallet Balance: {wallet.balance}</Label>
      <Label>ChainId: {wallet.chainId}</Label>
      {ENS && <Label>ENS: {ENS}</Label>}
      {signedMessage && (
        <>
          <Label> Signed Message: {signedMessage}</Label>
          <Label>Public Key: {publicKey} </Label>
        </>
      )}

      {error && (
        <Label>
          <strong>Error:</strong> {errorMessage}
        </Label>
      )}
    </>
  );

  const CardFooter = () => (
    <CardFooterBase className="justify-around gap-4">
      {signer && (
        <Button className="" onClick={signDefaultMessage}>
          Sign a message
        </Button>
      )}
      <Button className="" disabled={disableConnect} onClick={disconnectWallet}>
        Disconnect Wallet
      </Button>
    </CardFooterBase>
  );

  if (!provider) {
    <Card className="min-w-[350px]">
      <Label>
        Please make sure you have a wallet installed in your browser
      </Label>
    </Card>;
  }

  if (isConnecting) {
    return (
      <Card className="min-w-[350px]">
        <Label>Connecting...</Label>
      </Card>
    );
  }

  return (
    <Card className="min-w-[350px]" style={customCardStyle}>
      <div className="flex flex-row justify-between">
        <CardHeader>
          <CardTitle>{cardTitle || "Your Web3 Profile"}</CardTitle>
          <CardDescription>
            {cardDescription || "Card Description"}
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <Avatar>
            <AvatarImage
              src={
                avatar ||
                "https://ethereum.org/static/655aaefb744ae2f9f818095a436d38b5/e1ebd/eth-diamond-purple-purple.png"
              }
            />
          </Avatar>
        </div>
      </div>
      <CardContent className="grid grid-cols-1 gap-2 min-w-fit">
        {hasAccount ? loggedInContent : defaultContent}
      </CardContent>
      {hasAccount && <CardFooter />}
    </Card>
  );
};

Web3Card.defaultProps = {
  customCardStyle: {},
};

export default Web3Card;
