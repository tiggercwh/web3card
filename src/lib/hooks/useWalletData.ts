import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ethers, EnsResolver } from "ethers";
import type { JsonRpcSigner } from "ethers";

type WalletData = {
  accounts: string[];
  balance: string;
  chainId: number;
};

export const useWalletData = () => {
  const initialState = { accounts: [] as string[], balance: "" } as WalletData;
  const [latestWallet, setLatestWallet] = useLocalStorage(
    "web3-wallet",
    initialState
  );
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [signedMessage, setSignedMessage] = useState("");

  const [wallet, setWallet] = useState<WalletData>(latestWallet);
  const [publicKey, setPublicKey] = useState(null);
  const [avatar, setAvatar] = useState<string | null>("");

  const [ENS, setENS] = useState<string | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        getProvider().then((provider) => updateWallet(accounts, provider));
      } else {
        // if length 0, user is disconnected
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const initialProvider = await new ethers.BrowserProvider(window.ethereum);

      if (initialProvider) {
        const signer = await initialProvider.getSigner();
        setSigner(signer);

        // Get the address of the current MetaMask wallet
        const address = await signer.getAddress();

        // Resolve the ENS name associated with the address
        const ensName = await initialProvider.lookupAddress(address);
        setENS(ensName);

        const ensresolver = new EnsResolver(initialProvider, address, ensName!);
        const avatar = await ensresolver.getAvatar();
        setAvatar(avatar);
      }
      return initialProvider;
    };

    if (!window.ethereum) return;

    getProvider().then((provider) => {
      setProvider(provider);
    });
    window.ethereum.on("accountsChanged", refreshAccounts);
    window.ethereum.on("chainChanged", refreshChain);

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, [window.ethereum]);

  const updateWallet = useCallback(
    async (accounts: any, provider: ethers.BrowserProvider) => {
      const rawBalance = await provider!.getBalance(accounts[0]);
      const balance = ethers.formatEther(rawBalance);

      const { chainId: rawChainId } = await provider!.getNetwork();
      const chainId = Number(rawChainId);
      const pub_key = await provider.send("eth_getEncryptionPublicKey", [
        accounts[0],
      ]);
      setPublicKey(pub_key);
      setWallet({ accounts, balance, chainId });
      setLatestWallet({ accounts, balance, chainId });
    },
    [provider]
  );

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    const provider = await new ethers.BrowserProvider(window.ethereum);
    provider
      .send("eth_requestAccounts", [])
      .then(async (accounts) => {
        if (accounts.length > 0) {
          setError(false);
          await updateWallet(accounts, provider);
        }
      })
      .catch((err: any) => {
        setError(true);
        setErrorMessage(err.message);
      });
    setIsConnecting(false);
  }, [provider, updateWallet]);

  const disconnectWallet = useCallback(async () => {
    if (!provider) return;
    await provider.send("eth_requestAccounts", ["disconnect"]);
    setWallet(initialState);
  }, [provider]);

  const signDefaultMessage = useCallback(async () => {
    const message = "Hello World!";
    const signature = await signer!.signMessage(message);
    setSignedMessage(signature);
  }, [signer]);

  const disableConnect = Boolean(wallet) && isConnecting;

  return {
    disconnectWallet,
    provider,
    signer,
    wallet,
    avatar,
    handleConnect,
    disableConnect,
    publicKey,
    ENS,
    isConnecting,
    error,
    errorMessage,
    signedMessage,
    signDefaultMessage,
  };
};
