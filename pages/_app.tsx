import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createClient,
  goerli,
  mainnet,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli, mainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "https://rpc.dev.buildbear.io/absolute-taun-we-0bf9874a",
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className=" bg-slate-700 min-h-screen max-h-fit min-w-max p-2">
          <div className="flex mt-0 m-2 p-2 justify-end rounded-lg bg-white bg-opacity-30">
            <ConnectButton />
          </div>

          <div className="grid grid-cols-home-sm sm:grid-cols-home-md md:grid-cols-home-lg">
            <div className=""></div>
            <div className="content">
              <Component {...pageProps} />
            </div>
            <div className=""></div>
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
