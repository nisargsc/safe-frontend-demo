import type { NextPage } from "next";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { Signer, ethers } from "ethers";
import {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from "@safe-global/protocol-kit";
import {
  getApiKit,
  getContractNetworks,
  getEthAdapter,
  getSafeSdk,
} from "../utils/safeUtils";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const [connected, setConnected] = useState(false);
  const [safeAddress, setSafeAddress] = useState("");
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  let owner2Ref = useRef<HTMLInputElement>(null);
  let owner3Ref = useRef<HTMLInputElement>(null);
  let thresholdRef = useRef<HTMLInputElement>(null);

  let safeAddressRef = useRef<HTMLInputElement>(null);

  let toRef = useRef<HTMLInputElement>(null);
  let valueRef = useRef<HTMLInputElement>(null);
  let dataRef = useRef<HTMLInputElement>(null);

  let txnHash1Ref = useRef<HTMLInputElement>(null);
  let txnHash2Ref = useRef<HTMLInputElement>(null);

  if (connected) {
    if (!safeAddress) {
      return (
        <>
          <div className="card text-center">
            <span className=" font-medium">{address}</span>
          </div>

          <div className="card flex flex-col p-2 items-center">
            <input
              ref={owner2Ref}
              type="text"
              placeholder="owner2"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>
            <input
              ref={owner3Ref}
              type="text"
              placeholder="owner3"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>

            <input
              ref={thresholdRef}
              type="number"
              placeholder="threshold"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>

            <div className="flex justify-center">
              <button
                className="button font-medium"
                onClick={async () => {
                  await deploySafe(
                    address as string,
                    owner2Ref.current?.value as string,
                    owner3Ref.current?.value as string,
                    thresholdRef.current?.value as unknown as number,
                    signer as Signer
                  );
                }}
              >
                <a> Deploy Safe! </a>
              </button>
            </div>

            <span> OR </span>
            <input
              ref={safeAddressRef}
              type="text"
              placeholder="safeAddress"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>
            <div className="flex justify-center">
              <button
                className="button font-medium"
                onClick={async () => {
                  setSafeAddress(safeAddressRef.current?.value as string);
                }}
              >
                <a> Connect to Safe! </a>
              </button>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="card text-center">
            <span className=" font-medium">{address}</span>
          </div>

          <div className="card text-center">
            <span className=" font-medium">Safe Address: {safeAddress}</span>
          </div>

          <div className="card flex flex-col p-2 items-center">
            <input
              ref={toRef}
              type="text"
              placeholder="to"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>
            <input
              ref={valueRef}
              type="text"
              placeholder="value in eth"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>

            <input
              ref={dataRef}
              type="text"
              placeholder="data"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>

            <div className="flex justify-center">
              <button
                className="button font-medium"
                onClick={async () => {
                  await proposeTxn(
                    signer as Signer,
                    toRef.current?.value as string,
                    valueRef.current?.value as string,
                    dataRef.current?.value as string
                  );
                }}
              >
                <a> Propose Transaction </a>
              </button>
            </div>
          </div>

          <div className="card flex flex-col p-2 items-center">
            <input
              ref={txnHash1Ref}
              type="text"
              placeholder="txnHash"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>

            <div className="flex justify-center">
              <button
                className="button font-medium"
                onClick={async () => {
                  await confirmTxn(
                    signer as Signer,
                    txnHash1Ref.current?.value as string
                  );
                }}
              >
                <a> Confirm Transaction </a>
              </button>
            </div>
          </div>

          <div className="card flex flex-col p-2 items-center">
            <input
              ref={txnHash2Ref}
              type="text"
              placeholder="txnHash"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>

            <div className="flex justify-center">
              <button
                className="button font-medium"
                onClick={async () => {
                  await execTxn(
                    signer as Signer,
                    txnHash2Ref.current?.value as string
                  );
                }}
              >
                <a> Execute Transaction </a>
              </button>
            </div>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div className="flex justify-center card">
        <span>Not connected</span>
      </div>
    </>
  );

  async function deploySafe(
    owner1: string,
    owner2: string,
    owner3: string,
    threshold: number,
    signer: Signer
  ) {
    const ethAdapter = getEthAdapter(signer);
    const chainId = await ethAdapter.getChainId();
    const contractNetworks = getContractNetworks(chainId);
    const safeFactory = await SafeFactory.create({
      ethAdapter,
      contractNetworks,
    });

    const safeAccountConfig: SafeAccountConfig = {
      owners: [owner1, owner2, owner3],
      threshold: threshold,
    };

    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
    const safeAddress = await safeSdk.getAddress();

    setSafeAddress(safeAddress);
  }

  async function proposeTxn(
    signer: Signer,
    to: string,
    value: string,
    data: string
  ) {
    const ethAdaper = getEthAdapter(signer);
    const safeService = getApiKit(ethAdaper);
    const safeSdk = await getSafeSdk(safeAddress, ethAdaper);
    const ethValue = ethers.utils.parseEther(value).toString();

    // Create Transaction
    const safeTransactionData: SafeTransactionDataPartial = {
      to,
      data,
      value: ethValue,
    };

    const safeTransaction = await safeSdk.createTransaction({
      safeTransactionData,
    });

    // Sign the Transaction
    const safeTxnHash = await safeSdk.getTransactionHash(safeTransaction);
    console.log({ safeTxnHash });
    const sign = await safeSdk.signTransactionHash(safeTxnHash);

    // Propose Transaction
    await safeService.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash: safeTxnHash,
      senderAddress: await signer.getAddress(),
      senderSignature: sign.data,
    });
  }

  async function confirmTxn(signer: Signer, txnHash: string) {
    const ethAdaper = getEthAdapter(signer);
    const safeService = getApiKit(ethAdaper);
    const safeSdk = await getSafeSdk(safeAddress, ethAdaper);

    // Sign the Transaction
    const sign = await safeSdk.signTransactionHash(txnHash);

    // Confirm Transaction
    const resp = await safeService.confirmTransaction(txnHash, sign.data);
    console.log(resp);
  }

  async function execTxn(signer: Signer, txnHash: string) {
    const ethAdaper = getEthAdapter(signer);
    const safeService = getApiKit(ethAdaper);
    const safeSdk = await getSafeSdk(safeAddress, ethAdaper);

    const safeTransaction = await safeService.getTransaction(txnHash);
    const execTxnResp = await safeSdk.executeTransaction(safeTransaction);
    const receipt = await execTxnResp.transactionResponse?.wait();

    console.log("Transaction executed:");
    console.log(`https://goerli.etherscan.io/tx/${receipt?.transactionHash}`);
  }
};

export default Home;
