"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Shield,
  Star,
  Award,
  BarChart3,
  PieChart,
  Zap,
  CheckCircle,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { ethers } from "ethers";

// =======================
// Addresses — Only need yield vault
// =======================
const YIELD_VAULT_ADDRESS = "0x1234567890123456789012345678901234567890"; // TODO: replace

// =======================
// DuckChain Network Configs
// =======================
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

const DEFAULT_NETWORK = DUCKCHAIN_MAINNET;

// =======================
// Simplified ABI for TON-only vault
// =======================
const YIELD_VAULT_ABI = [
  // Basic deposit/withdraw functions that accept native TON
  "function deposit() payable returns (uint256 shares)",
  "function withdraw(uint256 shares) returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function getYieldRate() view returns (uint256)",
  // Optional: Add any other vault-specific functions you need
];

// =======================
// UI Types (unchanged)
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
  const [depositAmount, setDepositAmount] = useState<string>("1"); // Default to 1 TON
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tonNativeBalance, setTonNativeBalance] = useState<string>("0.0");

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

  const refreshBalances = useCallback(async () => {
    if (!provider || !walletAddress) return;
    try {
      // Only need native TON balance now
      const native = await provider.getBalance(walletAddress);
      setTonNativeBalance(ethers.utils.formatEther(native));
    } catch (err) {
      console.error("Balance refresh error:", err);
      if (!err.message?.includes("ENS")) {
        setStatusMessage(`Balance refresh error: ${err.message}`);
      }
    }
  }, [provider, walletAddress]);

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

      const web3Provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      await web3Provider.send("eth_requestAccounts", []);
      const currentSigner = web3Provider.getSigner();
      const addr = await currentSigner.getAddress();

      setProvider(web3Provider);
      setSigner(currentSigner);
      setWalletAddress(addr);

      await refreshBalances();

      setStatusMessage(`✅ Connected to ${DEFAULT_NETWORK.name}`);

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
  }, [isConnecting, refreshBalances]);

  // Refresh balances on important changes
  useEffect(() => {
    refreshBalances();
  }, [walletAddress, provider, refreshBalances]);

  // =======================
  // Deposit flow - SIMPLIFIED for TON only
  // =======================
  const handleDeposit = async () => {
    if (!signer || !walletAddress || !provider)
      return setStatusMessage("Please connect your wallet first.");

    if (!YIELD_VAULT_ADDRESS.startsWith("0x"))
      return setStatusMessage("Vault address not configured.");

    const amount = depositAmount.trim();
    if (!amount || Number(amount) <= 0)
      return setStatusMessage("Enter a valid amount.");

    setIsDepositing(true);

    try {
      const vault = new ethers.Contract(
        YIELD_VAULT_ADDRESS,
        YIELD_VAULT_ABI,
        signer
      );

      // Convert TON amount to wei
      const valueWei = ethers.utils.parseEther(amount);

      setStatusMessage("Depositing TON into Yield Vault…");

      // Direct deposit with native TON - no approval needed!
      const tx = await vault.deposit({
        value: valueWei,
        gasLimit: 250000,
      });

      setStatusMessage(`Deposit sent: ${tx.hash}`);
      await tx.wait();
      setStatusMessage(`✅ Deposit of ${amount} TON successful!`);

      await refreshBalances();
    } catch (error: any) {
      console.error("Deposit error:", error);
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
  // Withdraw function (optional)
  // =======================
  const handleWithdraw = async () => {
    if (!signer || !walletAddress) return;

    setIsWithdrawing(true);
    try {
      const vault = new ethers.Contract(
        YIELD_VAULT_ADDRESS,
        YIELD_VAULT_ABI,
        signer
      );

      // Get user's shares balance
      const shares = await vault.balanceOf(walletAddress);
      if (shares.isZero()) {
        setStatusMessage("No shares to withdraw");
        return;
      }

      setStatusMessage("Withdrawing from vault…");
      const tx = await vault.withdraw(shares, { gasLimit: 250000 });
      await tx.wait();
      setStatusMessage("✅ Withdrawal successful!");

      await refreshBalances();
    } catch (error: any) {
      console.error("Withdraw error:", error);
      setStatusMessage(`❌ Withdrawal failed: ${error.message}`);
    } finally {
      setIsWithdrawing(false);
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
  // Render - SIMPLIFIED UI
  // =======================
  return (
    <div className="h-full flex flex-col bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            TON Yield Optimization
          </h2>
        </div>

        {/* Wallet Connection */}
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r text-[.8rem] from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all mb-3"
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
            <div className="flex items-center text-[.8rem] justify-between text-sm text-slate-700 dark:text-slate-300 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
              <span>
                Connected: {walletAddress.substring(0, 6)}…
                {walletAddress.substring(walletAddress.length - 4)}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                TON: {Number(tonNativeBalance).toFixed(4)}
              </span>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-4">
          {statusMessage}
        </p>

        {/* Amount Input - SIMPLIFIED */}
        {walletAddress && (
          <div className="mb-4">
            <label
              htmlFor="depositAmount"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Amount (TON)
            </label>
            <input
              type="number"
              id="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g., 1.0"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.1"
            />
          </div>
        )}

        {/* Actions - SIMPLIFIED */}
        <div className="grid grid-cols-1 gap-2">
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
                Deposit {depositAmount} TON
              </>
            )}
          </button>

          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing || !walletAddress}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all"
          >
            {isWithdrawing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Withdrawing…
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Withdraw All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rest of the UI remains unchanged */}
      {/* Wallet Analysis */}
      {/* {walletAnalysis && (
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
      )} */}

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
