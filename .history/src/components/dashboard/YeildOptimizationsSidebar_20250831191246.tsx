"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Shield,
  Star,
  Target,
  Award,
  BarChart3,
  PieChart,
  Zap,
  CheckCircle,
  AlertCircle,
  BadgeCheck,
  Wallet,
} from "lucide-react";
import { ethers } from "ethers";

// =======================
// Addresses — FILL THESE
// =======================
const USDC_ADDRESS_DUCKCHAIN = "0xYourUSDCaddressOnDuckChain"; // TODO: replace
const WTON_ADDRESS_DUCKCHAIN = "0xYourWTONaddressOnDuckChain"; // TODO: replace (Wrapped TON ERC-20)
const PROTEGO_YIELD_VAULT_CORE_ADDRESS = "0xYourVaultAddressOnDuckChain"; // TODO: replace (ERC-4626-compatible)

// =======================
// DuckChain Network Configs
// =======================
// Mainnet
const DUCKCHAIN_MAINNET = {
  chainId: 5545,
  name: "DuckChain Mainnet",
  nativeCurrency: { name: "TON", symbol: "TON", decimals: 18 },
  rpcUrls: [
    "https://rpc.duckchain.io",
    "https://duckchain-mainnet.public.blastapi.io",
  ],
  blockExplorerUrls: ["https://scan.duckchain.io"],
};

// Testnet (optional — uncomment when you want to target testnet; update RPC if differs)
const DUCKCHAIN_TESTNET = {
  chainId: 6545, // <— placeholder; replace with the official testnet chainId when available
  name: "DuckChain Testnet",
  nativeCurrency: { name: "TON", symbol: "TON", decimals: 18 },
  rpcUrls: ["https://testnet-rpc.duckchain.io"], // from docs/examples
  blockExplorerUrls: ["https://scan-testnet.duckchain.io"], // placeholder
};

// Toggle which network you want by default
const DEFAULT_NETWORK = DUCKCHAIN_MAINNET; // or DUCKCHAIN_TESTNET

// =======================
// Types
// =======================
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

// Remove global declaration for window.ethereum to avoid type conflicts.
// The type should be defined in /src/app/types/global.d.ts.

// =======================
// Minimal ABIs
// =======================
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  // optional EIP-2612 (not required here)
  // "function nonces(address owner) view returns (uint256)",
];

// Wrapped TON (WTON) — WETH-style interface
const WTON_ABI = [
  ...ERC20_ABI,
  "function deposit() payable",
  "function withdraw(uint256)",
];

// Vault (ERC-4626-like)
const PROTEGO_YIELD_VAULT_CORE_ABI = [
  "function deposit(uint256 assets, address receiver) returns (uint256 shares)",
  "function withdraw(uint256 shares, address receiver, address owner) returns (uint256 assets)",
  "function balanceOf(address account) view returns (uint256)",
];

// =======================
// UI Types
// =======================
interface YieldOptimizationSidebarProps {
  onOptimize?: (strategy: string) => void;
  onEmergencyWithdrawal?: () => void;
  onSpellCast?: (actionName: string) => void;
}

interface StakingOpportunity {
  id: string;
  protocol: string;
  apy: number;
  tvl: string;
  riskScore: number;
  minAmount: string;
  description: string;
  verified: boolean;
  strategy: string;
}

interface WalletAnalysis {
  totalValue: number;
  currentAPY: number;
  recommendations: string[];
  riskDistribution: { low: number; medium: number; high: number };
}

// =======================
// Component
// =======================
export const YieldOptimizationSidebar: React.FC<
  YieldOptimizationSidebarProps
> = ({
  onOptimize = () => {},
  onEmergencyWithdrawal = () => {},
  onSpellCast = () => {},
}) => {
  // --- UI state ---
  const [opportunities, setOpportunities] = useState<StakingOpportunity[]>([]);
  const [walletAnalysis, setWalletAnalysis] = useState<WalletAnalysis | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Web3 state ---
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Please connect your wallet."
  );
  const [depositAmount, setDepositAmount] = useState<string>("100");
  const [assetChoice, setAssetChoice] = useState<"USDC" | "TON">("USDC");
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // balances / token info
  const [usdcInfo, setUsdcInfo] = useState<{
    symbol: string;
    decimals: number;
  } | null>(null);
  const [wtonInfo, setWtonInfo] = useState<{
    symbol: string;
    decimals: number;
  } | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>("0.0");
  const [tonNativeBalance, setTonNativeBalance] = useState<string>("0.0");
  const [wtonBalance, setWtonBalance] = useState<string>("0.0");

  // Mock data (unchanged UI demos)
  useEffect(() => {
    const mockOpportunities: StakingOpportunity[] = [
      {
        id: "1",
        protocol: "Astro LP (DuckChain)",
        apy: 18.5,
        tvl: "4.2M TON",
        riskScore: 85,
        minAmount: "1 TON",
        description: "Stable LP pair with auto-compounding rewards",
        verified: true,
        strategy: "conservative-lp",
      },
      {
        id: "2",
        protocol: "Stella Farms",
        apy: 24.3,
        tvl: "2.1M TON",
        riskScore: 72,
        minAmount: "0.5 TON",
        description: "High-yield farming with bonus token rewards",
        verified: true,
        strategy: "aggressive-farm",
      },
      {
        id: "3",
        protocol: "Dragon Vaults",
        apy: 31.7,
        tvl: "1.8M TON",
        riskScore: 65,
        minAmount: "2 TON",
        description: "Aggressive yield strategy with higher volatility",
        verified: false,
        strategy: "high-risk-vault",
      },
    ];

    const mockWalletAnalysis: WalletAnalysis = {
      totalValue: 12450.67,
      currentAPY: 8.2,
      recommendations: [
        "Move 30% from idle to Astro LP",
        "Diversify into 2-3 protocols",
        "Current risk exposure is too conservative",
      ],
      riskDistribution: { low: 65, medium: 25, high: 10 },
    };

    setOpportunities(mockOpportunities);
    setWalletAnalysis(mockWalletAnalysis);
  }, []);

  // =======================
  // Helpers
  // =======================
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Create a custom provider that doesn't support ENS
  const createDuckChainProvider = () => {
    if (!window.ethereum) return null;

    // Create a custom provider with ENS disabled
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);

    // Override the resolveName method to prevent ENS resolution
    provider.resolveName = async (name: string) => {
      // If it's a valid address, return it directly
      if (ethers.utils.isAddress(name)) {
        return name;
      }
      // Otherwise, throw an error or return null
      throw new Error("ENS is not supported on DuckChain");
    };

    return provider;
  };

  const switchToDuckChain = async () => {
    if (!window.ethereum) return false;

    const hexChainId = `0x${DEFAULT_NETWORK.chainId.toString(16)}`;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
      return true;
    } catch (switchError: any) {
      if (
        switchError?.code === 4902 ||
        /unknown chain/i.test(String(switchError?.message))
      ) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexChainId,
                chainName: DEFAULT_NETWORK.name,
                nativeCurrency: DEFAULT_NETWORK.nativeCurrency,
                rpcUrls: DEFAULT_NETWORK.rpcUrls,
                blockExplorerUrls: DEFAULT_NETWORK.blockExplorerUrls,
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Failed to add DuckChain:", addError);
          return false;
        }
      }
      console.error("Failed to switch network:", switchError);
      return false;
    }
  };

  const loadTokenInfo = useCallback(
    async (
      web3Provider: ethers.providers.Web3Provider,
      tokenAddress: string,
      isWton = false
    ) => {
      const contract = new ethers.Contract(
        tokenAddress,
        isWton ? WTON_ABI : ERC20_ABI,
        web3Provider
      );
      const [symbol, decimals] = await Promise.all([
        contract.symbol(),
        contract.decimals(),
      ]);
      return { symbol: String(symbol), decimals: Number(decimals) };
    },
    []
  );

  const refreshBalances = useCallback(async () => {
    if (!provider || !walletAddress) return;
    try {
      // Native TON balance - use getBalance directly
      const native = await provider.getBalance(walletAddress);
      setTonNativeBalance(ethers.utils.formatEther(native));

      // USDC
      if (USDC_ADDRESS_DUCKCHAIN && USDC_ADDRESS_DUCKCHAIN.startsWith("0x")) {
        const usdc = new ethers.Contract(
          USDC_ADDRESS_DUCKCHAIN,
          ERC20_ABI,
          provider
        );
        const bal = await usdc.balanceOf(walletAddress);
        const dec = usdcInfo?.decimals ?? (await usdc.decimals());
        setUsdcBalance(ethers.utils.formatUnits(bal, dec));
      }

      // WTON
      if (WTON_ADDRESS_DUCKCHAIN && WTON_ADDRESS_DUCKCHAIN.startsWith("0x")) {
        const wton = new ethers.Contract(
          WTON_ADDRESS_DUCKCHAIN,
          WTON_ABI,
          provider
        );
        const bal = await wton.balanceOf(walletAddress);
        const dec = wtonInfo?.decimals ?? (await wton.decimals());
        setWtonBalance(ethers.utils.formatUnits(bal, dec));
      }
    } catch (err) {
      console.error("Balance refresh error:", err);
      // Don't show ENS-related errors to the user
      if (!err.message?.includes("ENS")) {
        setStatusMessage(`Balance refresh error: ${err.message}`);
      }
    }
  }, [provider, walletAddress, usdcInfo?.decimals, wtonInfo?.decimals]);

  // =======================
  // Connect Wallet
  // =======================
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setStatusMessage("MetaMask (or compatible) not detected.");
      return;
    }
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      setStatusMessage("Connecting wallet…");

      const switched = await switchToDuckChain();
      if (!switched) {
        setStatusMessage(
          `Please switch to ${DEFAULT_NETWORK.name} in MetaMask.`
        );
        setIsConnecting(false);
        return;
      }

      // Use our custom provider with ENS disabled
      const web3Provider = createDuckChainProvider();
      if (!web3Provider) {
        throw new Error("Failed to create provider");
      }

      await web3Provider.send("eth_requestAccounts", []);
      const currentSigner = web3Provider.getSigner();
      const addr = await currentSigner.getAddress();

      setProvider(web3Provider);
      setSigner(currentSigner);
      setWalletAddress(addr);

      // Prefetch token info
      try {
        if (USDC_ADDRESS_DUCKCHAIN.startsWith("0x")) {
          const info = await loadTokenInfo(
            web3Provider,
            USDC_ADDRESS_DUCKCHAIN
          );
          setUsdcInfo(info);
        }
        if (WTON_ADDRESS_DUCKCHAIN.startsWith("0x")) {
          const info = await loadTokenInfo(
            web3Provider,
            WTON_ADDRESS_DUCKCHAIN,
            true
          );
          setWtonInfo(info);
        }
      } catch (e) {
        console.warn("Token info fetch warning:", e);
      }

      await refreshBalances();

      setStatusMessage(
        `✅ Connected to ${DEFAULT_NETWORK.name} | ${addr.slice(0, 6)}…${addr.slice(-4)}`
      );

      // Listen for changes
      window.ethereum?.on?.("accountsChanged", () => window.location.reload());
      window.ethereum?.on?.("chainChanged", () => window.location.reload());
    } catch (error: any) {
      console.error("Connection error:", error);
      setStatusMessage(`❌ Connection failed: ${error?.message || error}`);
      setProvider(null);
      setSigner(null);
      setWalletAddress(null);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, loadTokenInfo, refreshBalances]);

  // Refresh balances on important changes
  useEffect(() => {
    refreshBalances();
  }, [walletAddress, provider, assetChoice, refreshBalances]);

  // =======================
  // Approve (USDC or WTON depending on the selected asset)
  // =======================
  const handleApprove = async () => {
    if (!signer || !walletAddress)
      return setStatusMessage("Please connect your wallet first.");

    const amount = depositAmount.trim();
    if (!amount || Number(amount) <= 0)
      return setStatusMessage("Enter a valid amount.");

    try {
      setIsApproving(true);
      setStatusMessage("Preparing approval transaction…");

      const isTON = assetChoice === "TON";
      const tokenAddress = isTON
        ? WTON_ADDRESS_DUCKCHAIN
        : USDC_ADDRESS_DUCKCHAIN;
      const tokenInfo = isTON ? wtonInfo : usdcInfo;

      if (!tokenAddress || !tokenAddress.startsWith("0x"))
        throw new Error("Token address is not set.");

      // Ensure decimals known
      let decimals = tokenInfo?.decimals;
      const token = new ethers.Contract(
        tokenAddress,
        isTON ? WTON_ABI : ERC20_ABI,
        signer
      );
      if (decimals == null) decimals = Number(await token.decimals());

      const units = ethers.utils.parseUnits(amount, decimals);

      // Show current allowance
      try {
        const allowance = await token.allowance(
          walletAddress,
          PROTEGO_YIELD_VAULT_CORE_ADDRESS
        );
        console.log("Current allowance:", allowance.toString());
      } catch {}

      const tx = await token.approve(PROTEGO_YIELD_VAULT_CORE_ADDRESS, units, {
        gasLimit: 120000,
      });
      setStatusMessage(`Approval sent: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log("Approval receipt:", receipt?.transactionHash);
      setStatusMessage("✅ Approval confirmed.");
    } catch (error: any) {
      console.error("Approve error:", error);
      setStatusMessage(
        `❌ Approval failed: ${error?.reason || error?.message || error}`
      );
    } finally {
      setIsApproving(false);
    }
  };

  // =======================
  // Deposit flow
  // - If USDC: deposit directly
  // - If TON: auto-wrap to WTON (deposit() payable), then approve (if needed) and deposit to vault
  // =======================
  const handleDeposit = async () => {
    if (!signer || !walletAddress || !provider)
      return setStatusMessage("Please connect your wallet first.");

    if (!PROTEGO_YIELD_VAULT_CORE_ADDRESS.startsWith("0x"))
      return setStatusMessage("Vault address not configured.");

    const amount = depositAmount.trim();
    if (!amount || Number(amount) <= 0)
      return setStatusMessage("Enter a valid amount.");

    setIsDepositing(true);

    try {
      const isTON = assetChoice === "TON";
      const tokenAddress = isTON
        ? WTON_ADDRESS_DUCKCHAIN
        : USDC_ADDRESS_DUCKCHAIN;
      if (!tokenAddress || !tokenAddress.startsWith("0x"))
        throw new Error("Token address is not set.");

      const token = new ethers.Contract(
        tokenAddress,
        isTON ? WTON_ABI : ERC20_ABI,
        signer
      );

      // Ensure decimals
      const decimals: number = isTON
        ? (wtonInfo?.decimals ?? (await token.decimals()))
        : (usdcInfo?.decimals ?? (await token.decimals()));

      // If TON selected, wrap first (WTON.deposit with native value)
      if (isTON) {
        const valueWei = ethers.utils.parseEther(amount);
        setStatusMessage("Wrapping TON → WTON…");
        const wrapTx = await token.deposit({
          value: valueWei,
          gasLimit: 150000,
        });
        await wrapTx.wait();
        await wait(800);
      }

      // Approve (idempotent — user may have done this already)
      const units = ethers.utils.parseUnits(amount, decimals);
      setStatusMessage("Approving vault to spend tokens…");
      const approveTx = await token.approve(
        PROTEGO_YIELD_VAULT_CORE_ADDRESS,
        units,
        { gasLimit: 120000 }
      );
      await approveTx.wait();

      // Now deposit to vault
      const vault = new ethers.Contract(
        PROTEGO_YIELD_VAULT_CORE_ADDRESS,
        PROTEGO_YIELD_VAULT_CORE_ABI,
        signer
      );

      setStatusMessage("Depositing into Protego Yield Vault…");
      const tx = await vault.deposit(units, walletAddress, {
        gasLimit: 250000,
      });
      setStatusMessage(`Deposit sent: ${tx.hash}`);
      await tx.wait();
      setStatusMessage("✅ Deposit successful!");

      await refreshBalances();
    } catch (error: any) {
      console.error("Deposit error:", error);
      // Don't show ENS-related errors to the user
      if (!error.message?.includes("ENS")) {
        setStatusMessage(
          `❌ Deposit failed: ${error?.reason || error?.message || error}`
        );
      }
    } finally {
      setIsDepositing(false);
    }
  };

  // =======================
  // Mock strategy actions
  // =======================
  const analyzeWallet = async () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1600);
  };

  const handleEmergencyWithdrawal = async () => {
    setIsWithdrawing(true);
    onEmergencyWithdrawal();
    setTimeout(() => setIsWithdrawing(false), 1600);
  };

  // =======================
  // Small UI helpers
  // =======================
  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80)
      return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20";
    if (riskScore >= 60)
      return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20";
    return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20";
  };
  const getRiskIcon = (riskScore: number) => {
    if (riskScore >= 80)
      return <CheckCircle className="w-3 h-3 text-emerald-500" />;
    if (riskScore >= 60)
      return <AlertCircle className="w-3 h-3 text-yellow-500" />;
    return <AlertCircle className="w-3 h-3 text-red-500" />;
  };

  // =======================
  // Render
  // =======================
  return (
    <div className="h-full flex flex-col bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Yield Optimization
          </h2>
        </div>

        {/* Wallet Connection */}
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all mb-3"
          >
            {isConnecting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            {isConnecting ? "Connecting…" : `Connect (${DEFAULT_NETWORK.name})`}
          </button>
        ) : (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
              <span>
                Connected: {walletAddress.substring(0, 6)}…
                {walletAddress.substring(walletAddress.length - 4)}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                TON: {Number(tonNativeBalance).toFixed(4)}
              </span>
            </div>

            {/* Balances */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 border">
                <div className="text-slate-500">USDC</div>
                <div className="font-medium text-slate-800 dark:text-white">
                  {Number(usdcBalance || 0).toFixed(2)}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 border">
                <div className="text-slate-500">TON</div>
                <div className="font-medium text-slate-800 dark:text-white">
                  {Number(tonNativeBalance || 0).toFixed(4)}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 border">
                <div className="text-slate-500">WTON</div>
                <div className="font-medium text-slate-800 dark:text-white">
                  {Number(wtonBalance || 0).toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-4">
          {statusMessage}
        </p>

        {/* Asset selector + Amount */}
        {walletAddress && (
          <div className="mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAssetChoice("USDC")}
                className={`px-3 py-2 rounded border text-sm font-medium transition-all ${
                  assetChoice === "USDC"
                    ? "bg-blue-500/10 border-blue-400 text-blue-600 dark:text-blue-400"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                Use USDC (ERC-20)
              </button>
              <button
                onClick={() => setAssetChoice("TON")}
                className={`px-3 py-2 rounded border text-sm font-medium transition-all ${
                  assetChoice === "TON"
                    ? "bg-emerald-500/10 border-emerald-400 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                Use TON → WTON (auto-wrap)
              </button>
            </div>

            <div>
              <label
                htmlFor="depositAmount"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Amount (
                {assetChoice === "USDC" ? usdcInfo?.symbol || "USDC" : "TON"})
              </label>
              <input
                type="number"
                id="depositAmount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g., 100"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.0001"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDeposit}
            disabled={
              isDepositing ||
              !walletAddress ||
              !depositAmount ||
              Number(depositAmount) <= 0
            }
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all"
          >
            {isDepositing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Depositing…
              </>
            ) : (
              <>
                <ArrowDownRight className="w-4 h-4" />
                Deposit {depositAmount} {assetChoice}
              </>
            )}
          </button>

          <button
            onClick={handleApprove}
            disabled={
              isApproving ||
              !walletAddress ||
              !depositAmount ||
              Number(depositAmount) <= 0
            }
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all"
          >
            {isApproving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Approving…
              </>
            ) : (
              <>
                <BadgeCheck className="w-4 h-4" />
                Approve{" "}
                {assetChoice === "USDC"
                  ? usdcInfo?.symbol || "USDC"
                  : wtonInfo?.symbol || "WTON"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Wallet Analysis */}
      {walletAnalysis && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/50">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Portfolio Analysis
          </h3>

          <div className="space-y-3">
            <div className="bg-slate-100/50 dark:bg-slate-800/30 rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Total Value
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ${walletAnalysis.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Current Yield
                </span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {walletAnalysis.currentAPY}% APY
                </span>
              </div>
            </div>

            <div className="bg-slate-100/50 dark:bg-slate-800/30 rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                Risk Distribution
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Low Risk
                    </span>
                  </div>
                  <span className="font-medium">
                    {walletAnalysis.riskDistribution.low}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Medium Risk
                    </span>
                  </div>
                  <span className="font-medium">
                    {walletAnalysis.riskDistribution.medium}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      High Risk
                    </span>
                  </div>
                  <span className="font-medium">
                    {walletAnalysis.riskDistribution.high}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100/50 dark:bg-slate-800/30 rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                Recommendations
              </h4>
              <div className="space-y-1">
                {walletAnalysis.recommendations.map((rec, idx) => (
                  <p
                    key={idx}
                    className="text-xs text-slate-600 dark:text-slate-400"
                  >
                    • {rec}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staking Opportunities (mock) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Yield Opportunities ({opportunities.length})
          </h3>

          <div className="space-y-3">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-slate-100/50 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                        {opportunity.protocol}
                        {opportunity.verified && (
                          <Award className="w-3 h-3 text-blue-500" />
                        )}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {opportunity.description}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {opportunity.apy}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">TVL:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {opportunity.tvl}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Min:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {opportunity.minAmount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between col-span-2">
                      <span className="text-slate-500">Risk Score:</span>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 ${getRiskColor(opportunity.riskScore)}`}
                      >
                        {getRiskIcon(opportunity.riskScore)}
                        {opportunity.riskScore}/100
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOptimize(opportunity.strategy)}
                    className="w-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-500/30 hover:border-emerald-500/50 px-3 py-2 rounded text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2 transition-all"
                  >
                    <Activity className="w-4 h-4" />
                    Optimize Position
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/50">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            Quick Strategies
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={analyzeWallet}
              disabled={isAnalyzing || !walletAddress}
              className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 px-3 py-2 rounded text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <div className="w-3 h-3 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
              ) : (
                <BarChart3 className="w-3 h-3" />
              )}
              Analyze Portfolio
            </button>
            <button
              onClick={handleEmergencyWithdrawal}
              disabled={isWithdrawing || !walletAddress}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 px-3 py-2 rounded text-xs font-medium text-red-600 dark:text-red-400 flex items-center justify-center gap-1 transition-all disabled:opacity-50"
            >
              {isWithdrawing ? (
                <div className="w-3 h-3 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <Zap className="w-3 h-3" />
              )}
              Emergency Withdraw
            </button>
            <button
              onClick={() => onOptimize("safe-yield-strategy")}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 px-3 py-2 rounded text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 transition-all"
            >
              <Shield className="w-3 h-3" />
              Safe Yields
            </button>
            <button
              onClick={() => onOptimize("high-apy-strategy")}
              className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/30 px-3 py-2 rounded text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1 transition-all"
            >
              <Coins className="w-3 h-3" />
              High APY
            </button>
            <button
              onClick={() => onOptimize("auto-optimize-portfolio")}
              className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 px-3 py-2 rounded text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 transition-all col-span-2"
            >
              <Zap className="w-3 h-3" />
              Auto-Optimize Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
