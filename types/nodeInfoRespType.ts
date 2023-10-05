export interface nodeInfoRespType {
    nodeId: string;
    blockNumber: number;
    chainId: number;
    forkingDetails: {
        blockNumber: number;
        chainId: number;
    }
}