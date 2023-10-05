import type { NextPage } from "next";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { Signer, ethers } from "ethers";
import { SafeAccountConfig, SafeFactory } from "@safe-global/protocol-kit";
import {
  getContractNetworks,
  getEthAdapter,
  getExecTxn,
  getSafeSdk,
} from "../utils/safeUtils";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { HttpMethod, sendRequest } from "../utils/apiUtil";
import { apiRespType } from "../types/apiRespType";
import { nodeInfoRespType } from "../types/nodeInfoRespType";
import { sandboxInfoType } from "../types/sandboxInfoType";
import { getSandboxInfo } from "../utils/sandboxUtils";

const Home: NextPage = () => {
  // const nodeId = "absolute-taun-we-0bf9874a";
  const apiUrl = "https://backend.dev.buildbear.io";

  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const [connected, setConnected] = useState(false);
  const [safeAddress, setSafeAddress] = useState("");
  const [sandboxInfo, setSandboxInfo] = useState<sandboxInfoType>();
  const [nodeId, setNodeId] = useState("");
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  let rpcRef = useRef<HTMLInputElement>(null);

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
    if (!sandboxInfo) {
      return (
        <>
          <div className="card text-center">
            <span className=" font-medium">{address}</span>
          </div>

          <div className="card flex flex-col p-2 items-center">
            <input
              ref={rpcRef}
              type="text"
              placeholder="Sandbox URL"
              className="input w-full sm:w-3/4 md:w-2/3 lg:w-1/2"
            ></input>

            <div className="flex justify-center">
              <button
                className="button font-medium"
                onClick={async () => {
                  await connectToRpc(rpcRef.current?.value as string);
                }}
              >
                <a> Connect to sandbox! </a>
              </button>
            </div>
          </div>
        </>
      );
    } else {
      if (!safeAddress) {
        return (
          <>
            <div className="card text-center">
              <span className=" font-medium">{address}</span>
            </div>

            <div className="card flex flex-col p-2 items-center text-center">
              <span className=" font-medium">
                SandboxName: {sandboxInfo.sandboxName}
              </span>
              <span className=" font-medium">Forked from:</span>
              <span className=" font-medium">Chain: {sandboxInfo.chain}</span>
              <span className=" font-medium">
                Blocknumber: {sandboxInfo.blockNumber}
              </span>
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

            <div className="card flex flex-col p-2 items-center text-center">
              <span className=" font-medium">
                SandboxName: {sandboxInfo.sandboxName}
              </span>
              <span className=" font-medium">Forked from:</span>
              <span className=" font-medium">Chain: {sandboxInfo.chain}</span>
              <span className=" font-medium">
                Blocknumber: {sandboxInfo.blockNumber}
              </span>
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
  }

  return (
    <>
      <div className="flex justify-center card">
        <span>Not connected</span>
      </div>
    </>
  );

  async function connectToRpc(rpcUrl: string) {
    const resp: nodeInfoRespType = await sendRequest({
      url: rpcUrl,
      method: HttpMethod.Get,
    });
    console.log(resp);
    setNodeId(resp.nodeId);
    const sandboxInfo = getSandboxInfo(resp);
    setSandboxInfo(sandboxInfo);
  }
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

    // Propose Transaction
    const resp1: apiRespType = await sendRequest({
      url: `${apiUrl}/plugin/safe/proposeTransaction`,
      method: HttpMethod.Post,
      body: {
        nodeId,
        safeAddress,
        txnData: safeTransaction.data,
      },
    });
    console.log({ resp: resp1.txn });

    // Sign the Transaction
    const safeTxnHash = await safeSdk.getTransactionHash(safeTransaction);
    console.log({ safeTxnHash });
    const sign = await safeSdk.signTransactionHash(safeTxnHash);

    // Add Sign
    const resp2: apiRespType = await sendRequest({
      url: `${apiUrl}/plugin/safe/addSignature`,
      method: HttpMethod.Post,
      body: {
        nodeId,
        safeAddress,
        txnData: safeTransaction.data,
        sign,
      },
    });
    console.log({ resp: resp2.txn });
  }

  async function confirmTxn(signer: Signer, txnHash: string) {
    const ethAdaper = getEthAdapter(signer);
    const safeSdk = await getSafeSdk(safeAddress, ethAdaper);

    // Get the Transaction
    const resp1: apiRespType = await sendRequest({
      url: `${apiUrl}/plugin/safe/getTransaction`,
      method: HttpMethod.Get,
      query: {
        nodeId,
        safeAddress,
        txnHash,
      },
    });

    console.log({ resp1: resp1.txn });

    // Sign the Transaction
    const sign = await safeSdk.signTransactionHash(txnHash);

    // Add Sign
    const resp2: apiRespType = await sendRequest({
      url: `${apiUrl}/plugin/safe/addSignature`,
      method: HttpMethod.Post,
      body: {
        nodeId,
        safeAddress,
        txnData: resp1.txn.txnData,
        sign,
      },
    });
    console.log({ resp2: resp2.txn });
  }

  async function execTxn(signer: Signer, txnHash: string) {
    const ethAdaper = getEthAdapter(signer);
    const safeSdk = await getSafeSdk(safeAddress, ethAdaper);

    // Get the Transaction
    const resp1: apiRespType = await sendRequest({
      url: `${apiUrl}/plugin/safe/getTransaction`,
      method: HttpMethod.Get,
      query: {
        nodeId,
        safeAddress,
        txnHash,
      },
    });

    console.log({ resp: resp1.txn });
    const txn = await getExecTxn(ethAdaper, safeAddress, resp1);

    const execTxnResp = await safeSdk.executeTransaction(txn);
    const receipt = await execTxnResp.transactionResponse?.wait();

    console.log("Transaction executed:");
    console.log(`https://goerli.etherscan.io/tx/${receipt?.transactionHash}`);
  }
};

export default Home;
