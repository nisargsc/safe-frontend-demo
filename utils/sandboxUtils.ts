import { nodeInfoRespType } from "../types/nodeInfoRespType";
import { sandboxInfoType } from "../types/sandboxInfoType";

function getSandboxName(nodeId: string) {
  const words = nodeId.split("-");
  words.pop();
  const sandboxName = words.join(" ").toUpperCase();
  return sandboxName;
}

function getChainName(chainId: number) {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 5:
      return "Goerli Testnet";
    case 11155111:
      return "Sepolia Testnet";
    case 137:
      return "Polygon Mainnet";
    case 80001:
      return "Polygon Mumbai Testnet";
    case 42161:
      return "Arbitrum Mainnet";
    case 421613:
      return "Arbitrum Goerli";
    case 10:
      return "Optimism Mainnet";
    case 42114:
      return "Alalanche Mainnet";
    default:
      return "";
  }
}

export function getSandboxInfo(nodeInfoResp: nodeInfoRespType) {
  const sandboxName = getSandboxName(nodeInfoResp.nodeId);
  const blockNumber = nodeInfoResp.forkingDetails.blockNumber;
  const chain = getChainName(nodeInfoResp.forkingDetails.chainId);

  const sandboxInfo: sandboxInfoType = {
    sandboxName,
    blockNumber,
    chain,
  };

  return sandboxInfo
}

module.exports = {
  getSandboxInfo,
};
