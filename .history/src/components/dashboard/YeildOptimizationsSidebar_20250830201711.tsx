'use client'

// IMPORTANT: Ensure 'ethers' is installed in your project: npm install ethers
// This error often occurs if the library is not found in node_modules during bundling.

import React, { useState, useEffect, useCallback } from 'react'
import {
  TrendingUp, DollarSign, Activity, ArrowUpRight, ArrowDownRight,
  Coins, Shield, Star, Target, Award, BarChart3, PieChart,
  Zap, CheckCircle, AlertCircle, Search, BadgeCheck, Wallet
} from 'lucide-react'
import { ethers } from 'ethers'

// --- Contract Addresses (from your deployment logs) ---
const MOCK_USDC_ADDRESS = "0xa4b3Cd6AF5faA2800df38c64e1C24BEBb5291fD6";
const PROTEGO_YIELD_VAULT_CORE_ADDRESS = "0xf575eE8F71ac2A1A55B2C0B5e5D7d15d73626242";

// Sei Testnet Configuration
const SEI_TESTNET_CONFIG = {
  chainId: 1328,
  name: 'Sei Testnet',
  currency: 'SEI',
  rpcUrl: 'https://evm-rpc-testnet.sei-apis.com',
  blockExplorer: 'https://seitrace.com'
}


interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}




declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      selectedAddress?: string;
      chainId?: string;
      // Add event listener methods
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      // Add other methods you might use
      enable?: () => Promise<string[]>;
      send?: (method: string, params?: any[]) => Promise<any>;
    };
  }
}

// --- Enhanced ABIs with error handling ---
const MOCK_USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
  "function totalSupply() external view returns (uint256)"
];

const PROTEGO_YIELD_VAULT_CORE_ABI = [
  "function deposit(uint256 assets, address receiver) external returns (uint256 shares)",
  "function withdraw(uint256 shares, address receiver, address owner) external returns (uint256 assets)",
  "function balanceOf(address account) external view returns (uint256)"
];

interface YieldOptimizationSidebarProps {
  onOptimize?: (strategy: string) => void
  onEmergencyWithdrawal?: () => void
   onSpellCast?: (actionName: string) => void; // Add this
}

interface StakingOpportunity {
  id: string
  protocol: string
  apy: number
  tvl: string
  riskScore: number
  minAmount: string
  description: string
  verified: boolean
  strategy: string
}

interface WalletAnalysis {
  totalValue: number
  currentAPY: number
  recommendations: string[]
  riskDistribution: {
    low: number
    medium: number
    high: number
  }
}

export const YieldOptimizationSidebar: React.FC<YieldOptimizationSidebarProps> = ({ onOptimize, onEmergencyWithdrawal }) => {
  const [opportunities, setOpportunities] = useState<StakingOpportunity[]>([])
  const [walletAnalysis, setWalletAnalysis] = useState<WalletAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // --- Web3 States ---
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('Please connect your wallet.')
  const [depositAmount, setDepositAmount] = useState<string>('1000')
  const [isApproving, setIsApproving] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [userUSDCBalance, setUserUSDCBalance] = useState<string>('0.0')
  const [contractInfo, setContractInfo] = useState<any>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Mock data
  useEffect(() => {
    const mockOpportunities: StakingOpportunity[] = [
      {
        id: '1',
        protocol: 'Astroport LP',
        apy: 18.5,
        tvl: '4.2M SEI',
        riskScore: 85,
        minAmount: '100 SEI',
        description: 'Stable LP pair with auto-compounding rewards',
        verified: true,
        strategy: 'conservative-lp'
      },
      {
        id: '2',
        protocol: 'StellaSwap Farms',
        apy: 24.3,
        tvl: '2.1M SEI',
        riskScore: 72,
        minAmount: '50 SEI',
        description: 'High-yield farming with bonus token rewards',
        verified: true,
        strategy: 'aggressive-farm'
      },
      {
        id: '3',
        protocol: 'Dragonswap Vaults',
        apy: 31.7,
        tvl: '1.8M SEI',
        riskScore: 65,
        minAmount: '200 SEI',
        description: 'Aggressive yield strategy with higher volatility',
        verified: false,
        strategy: 'high-risk-vault'
      }
    ]

    const mockWalletAnalysis: WalletAnalysis = {
      totalValue: 12450.67,
      currentAPY: 8.2,
      recommendations: [
        'Move 30% from low-yield staking to Astroport LP',
        'Consider diversifying into 3 different protocols',
        'Current risk exposure is too conservative'
      ],
      riskDistribution: {
        low: 65,
        medium: 25,
        high: 10
      }
    }

    setOpportunities(mockOpportunities)
    setWalletAnalysis(mockWalletAnalysis)
  }, [])

  // --- Enhanced Network Switching ---
  const switchToSeiTestnet = async () => {
    if (!window.ethereum) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEI_TESTNET_CONFIG.chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${SEI_TESTNET_CONFIG.chainId.toString(16)}`,
              chainName: SEI_TESTNET_CONFIG.name,
              nativeCurrency: {
                name: 'SEI',
                symbol: 'SEI',
                decimals: 18,
              },
              rpcUrls: [SEI_TESTNET_CONFIG.rpcUrl],
              blockExplorerUrls: [SEI_TESTNET_CONFIG.blockExplorer],
            }],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Sei Testnet:', addError);
          return false;
        }
      }
      console.error('Failed to switch to Sei Testnet:', switchError);
      return false;
    }
  };

  // --- Enhanced Contract Verification with Debug ---
  const verifyContracts = async (web3Provider: ethers.providers.Web3Provider) => {
    try {
      console.log('=== CONTRACT VERIFICATION DEBUG ===');
      console.log('Provider details:', {
        url: web3Provider.connection?.url,
        network: await web3Provider.getNetwork()
      });
      
      const blockNumber = await web3Provider.getBlockNumber();
      console.log('Current block number:', blockNumber);
      
      setStatusMessage('Verifying contracts...');
      
      // Test USDC contract
      console.log('Creating USDC contract instance with address:', MOCK_USDC_ADDRESS);
      const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, MOCK_USDC_ABI, web3Provider);
      
      console.log('Testing contract code existence...');
      const contractCode = await web3Provider.getCode(MOCK_USDC_ADDRESS);
      console.log('Contract code length:', contractCode.length, 'bytes');
      
      if (contractCode === '0x' || contractCode.length <= 2) {
        throw new Error(`No contract deployed at address ${MOCK_USDC_ADDRESS}`);
      }
      
      console.log('Calling contract functions...');
      
      // Call functions individually with detailed logging
      console.log('Calling decimals()...');
      const decimals = await usdcContract.decimals();
      console.log('Decimals result:', decimals.toString());
      
      console.log('Calling symbol()...');
      const symbol = await usdcContract.symbol();
      console.log('Symbol result:', symbol);
      
      console.log('Calling name()...');
      const name = await usdcContract.name();
      console.log('Name result:', name);
      
      console.log('Calling totalSupply()...');
      const totalSupply = await usdcContract.totalSupply();
      console.log('Total supply:', ethers.utils.formatUnits(totalSupply, decimals));
      
      console.log(`✅ Contract verified: ${name} (${symbol}) with ${decimals} decimals`);
      
      const contractInfo = {
        name,
        symbol,
        decimals: decimals.toString(),
        address: MOCK_USDC_ADDRESS,
        totalSupply: ethers.utils.formatUnits(totalSupply, decimals)
      };
      
      setContractInfo(contractInfo);
      return { decimals, symbol, name, contract: usdcContract };
      
    } catch (error: any) {
      console.error('=== CONTRACT VERIFICATION ERROR ===');
      console.error('Full error:', error);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      console.error('Error reason:', error.reason);
      console.error('Error data:', error.data);
      console.error('Error transaction:', error.transaction);
      
      setStatusMessage(`❌ Contract verification failed: ${error.reason || error.message}`);
      throw error;
    }
  };

  // --- Enhanced Balance Fetching with Debug ---
  const fetchUSDCBalance = async (address: string, usdcContract: ethers.Contract, decimals: number) => {
    try {
      console.log('=== BALANCE FETCH DEBUG ===');
      console.log('Fetching balance for address:', address);
      console.log('Using decimals:', decimals);
      
      setStatusMessage('Fetching USDC balance...');
      
      console.log('Calling balanceOf...');
      const balance = await usdcContract.balanceOf(address);
      console.log('Raw balance (wei):', balance.toString());
      
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      console.log('Formatted balance:', formattedBalance);
      
      setUserUSDCBalance(formattedBalance);
      return formattedBalance;
      
    } catch (error: any) {
      console.error('=== BALANCE FETCH ERROR ===');
      console.error('Full error:', error);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      console.error('Error reason:', error.reason);
      
      setStatusMessage(`❌ Failed to fetch balance: ${error.reason || error.message}`);
      setUserUSDCBalance('Error');
      return '0.0';
    }
  };

  // --- Enhanced Wallet Connection with Debug ---
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      setStatusMessage('MetaMask or compatible wallet not detected.');
      return;
    }

    if (isConnecting) {
      console.log('Connection already in progress, skipping...');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      console.log('=== WALLET CONNECTION DEBUG ===');
      setStatusMessage('Connecting to wallet...');
      
      // Request accounts
      console.log('Requesting accounts...');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts received:', accounts);
      
      console.log('Creating Web3 provider...');
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum as EthereumProvider);      
      console.log('Getting network info...');
      const network = await web3Provider.getNetwork();
      console.log('Network details:', {
        name: network.name,
        chainId: network.chainId,
        ensAddress: network.ensAddress
      });
      
      console.log('Provider connection details:', {
        url: web3Provider.connection?.url || 'No URL available'
      });
      
      // Check if we're on Sei Testnet
      if (network.chainId !== SEI_TESTNET_CONFIG.chainId) {
        console.log(`Wrong network detected. Expected: ${SEI_TESTNET_CONFIG.chainId}, Got: ${network.chainId}`);
        setStatusMessage(`Wrong network detected (Chain ID: ${network.chainId}). Switching to Sei Testnet...`);
        const switched = await switchToSeiTestnet();
        if (!switched) {
          setStatusMessage(`Please manually switch to Sei Testnet (Chain ID: ${SEI_TESTNET_CONFIG.chainId})`);
          setIsConnecting(false);
          return;
        }
        // Refresh provider after network switch
        console.log('Waiting for network switch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newProvider = new ethers.providers.Web3Provider(window.ethereum as EthereumProvider);      
        const newNetwork = await newProvider.getNetwork();
        console.log('New network after switch:', newNetwork);
        setProvider(newProvider);
      } else {
        console.log('✅ Already on correct network');
        setProvider(web3Provider);
      }

      console.log('Getting signer...');
      const currentSigner = web3Provider.getSigner();
      setSigner(currentSigner);
      
      console.log('Getting wallet address...');
      const addr = await currentSigner.getAddress();
      console.log('Wallet address:', addr);
      setWalletAddress(addr);
      
      // Verify contracts and fetch balance
      try {
        console.log('Starting contract verification...');
        const { decimals, symbol, contract } = await verifyContracts(web3Provider);
        
        console.log('Starting balance fetch...');
        await fetchUSDCBalance(addr, contract, decimals);
        
        setStatusMessage(`✅ Connected to Sei Testnet | ${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`);
        
      } catch (contractError) {
        console.error('Contract operations failed:', contractError);
        setStatusMessage(`⚠️ Wallet connected but contract verification failed. Check contract addresses.`);
      }

      console.log('✅ Wallet connection complete');

    } catch (error: any) {
      console.error('=== WALLET CONNECTION ERROR ===');
      console.error('Full error:', error);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      setStatusMessage(`❌ Connection failed: ${error.message}`);
      setWalletAddress(null);
      setSigner(null);
      setProvider(null);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]); // Removed contractInfo dependency to prevent loops

  // No auto-connect - wait for user to manually connect
  // useEffect removed to prevent automatic connection attempts

  // Separate effect for balance fetching when wallet address or contract info changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchBalanceWhenReady = async () => {
      if (!isMounted) return;
      
      if (walletAddress && contractInfo && provider) {
        try {
          console.log('Fetching balance due to wallet/contract change...');
          const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, MOCK_USDC_ABI, provider);
          await fetchUSDCBalance(walletAddress, usdcContract, parseInt(contractInfo.decimals));
        } catch (error) {
          console.error('Balance fetch failed:', error);
        }
      }
    };

    fetchBalanceWhenReady();
    
    return () => {
      isMounted = false;
    };
  }, [walletAddress, contractInfo, provider]); // Added provider to ensure it's available

  // --- Enhanced Approve Functionality with Debug ---
  const handleApproveContract = async () => {
    if (!signer || !walletAddress) {
      setStatusMessage('Please connect your wallet first.');
      return;
    }

    if (!contractInfo) {
      setStatusMessage('Contract not verified. Please reconnect wallet.');
      return;
    }

    setIsApproving(true);
    
    try {
      console.log('=== APPROVAL DEBUG ===');
      console.log('Deposit amount:', depositAmount);
      console.log('Contract decimals:', contractInfo.decimals);
      
      setStatusMessage('Preparing approval transaction...');
      
      const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, MOCK_USDC_ABI, signer);
      const amountToApprove = ethers.utils.parseUnits(depositAmount, contractInfo.decimals);
      
      console.log('Amount to approve (wei):', amountToApprove.toString());
      console.log('Spender address:', PROTEGO_YIELD_VAULT_CORE_ADDRESS);
      
      // Check current allowance first
      console.log('Checking current allowance...');
      try {
        const currentAllowance = await usdcContract.allowance(walletAddress, PROTEGO_YIELD_VAULT_CORE_ADDRESS);
        console.log('Current allowance (wei):', currentAllowance.toString());
        console.log('Current allowance (formatted):', ethers.utils.formatUnits(currentAllowance, contractInfo.decimals));
      } catch (allowanceError) {
        console.log('Could not check allowance:', allowanceError);
      }

      setStatusMessage('Sending approval transaction...');
      console.log('Calling approve function...');
      
      const tx = await usdcContract.approve(PROTEGO_YIELD_VAULT_CORE_ADDRESS, amountToApprove, {
        gasLimit: 100000
      });
      
      console.log('Approval transaction sent:', tx.hash);
      console.log('Transaction details:', {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value?.toString(),
        gasLimit: tx.gasLimit?.toString(),
        gasPrice: tx.gasPrice?.toString()
      });
      
      setStatusMessage(`Approval transaction sent: ${tx.hash}`);
      
      console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      console.log('Gas used:', receipt.gasUsed?.toString());
      
      setStatusMessage(`✅ Approval successful for ${depositAmount} USDC!`);
      
    } catch (error: any) {
      console.error('=== APPROVAL ERROR ===');
      console.error('Full error:', error);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      console.error('Error reason:', error.reason);
      console.error('Error data:', error.data);
      
      setStatusMessage(`❌ Approval failed: ${error.reason || error.message || error}`);
    } finally {
      setIsApproving(false);
    }
  };

  // --- Enhanced Deposit Functionality ---
  const handleDeposit = async () => {
    if (!signer || !walletAddress) {
      setStatusMessage('Please connect your wallet first.');
      return;
    }

    if (!contractInfo) {
      setStatusMessage('Contract not verified. Please reconnect wallet.');
      return;
    }

    setIsDepositing(true);
    setStatusMessage('Depositing into Protego Yield Vault...');

    try {
      const yieldVaultCoreContract = new ethers.Contract(PROTEGO_YIELD_VAULT_CORE_ADDRESS, PROTEGO_YIELD_VAULT_CORE_ABI, signer);
      const amountToDeposit = ethers.utils.parseUnits(depositAmount, contractInfo.decimals);

      console.log(`Depositing ${depositAmount} USDC (${amountToDeposit.toString()} wei)`);
      
      const tx = await yieldVaultCoreContract.deposit(amountToDeposit, walletAddress, {
        gasLimit: 200000 // Set a reasonable gas limit
      });
      
      setStatusMessage(`Deposit transaction sent: ${tx.hash}`);
      await tx.wait();
      setStatusMessage(`✅ Deposit of ${depositAmount} USDC successful!`);

      // Update balance
      const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, MOCK_USDC_ABI, provider);
      await fetchUSDCBalance(walletAddress, usdcContract, parseInt(contractInfo.decimals));

    } catch (error: any) {
      console.error('Deposit failed:', error);
      setStatusMessage(`❌ Deposit failed: ${error.reason || error.message || error}`);
    } finally {
      setIsDepositing(false);
    }
  };

  const analyzeWallet = async () => {
    setIsAnalyzing(true);
    onOptimize('portfolio-analysis');
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const handleEmergencyWithdrawal = async () => {
    setIsWithdrawing(true);
    onEmergencyWithdrawal();
    setTimeout(() => setIsWithdrawing(false), 3000);
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20';
    if (riskScore >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20';
    return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20';
  };

  const getRiskIcon = (riskScore: number) => {
    if (riskScore >= 80) return <CheckCircle className="w-3 h-3 text-emerald-500" />;
    if (riskScore >= 60) return <AlertCircle className="w-3 h-3 text-yellow-500" />;
    return <AlertCircle className="w-3 h-3 text-red-500" />;
  };

  const handleOptimizeOpportunity = (opportunity: StakingOpportunity) => {
    onOptimize(opportunity.strategy);
  };

  return (
    <div className="h-full flex flex-col bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Yield Optimization</h2>
        </div>

        {/* Wallet Connection */}
        {!walletAddress ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all mb-2"
          >
            {isConnecting ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Wallet className="w-4 h-4" />
            )}
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
              <span>Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                USDC: {userUSDCBalance === 'Error' ? 'Error' : parseFloat(userUSDCBalance).toFixed(2)}
              </span>
            </div>
            {contractInfo && (
              <div className="text-xs text-slate-500 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded border">
                <div>Contract: {contractInfo.name} ({contractInfo.symbol})</div>
                <div>Decimals: {contractInfo.decimals}</div>
                <div>Total Supply: {contractInfo.totalSupply}</div>
                <div>Address: {contractInfo.address.substring(0, 10)}...</div>
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-4">{statusMessage}</p>

        {/* Amount Input */}
        {walletAddress && (
          <div className="mb-4">
            <label htmlFor="depositAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount (USDC)
            </label>
            <input
              type="number"
              id="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g., 1000"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>
        )}

        <button
          onClick={handleDeposit}
          disabled={isDepositing || !walletAddress || !depositAmount || parseFloat(depositAmount) <= 0 || !contractInfo}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all mb-2"
        >
          {isDepositing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Depositing...
            </>
          ) : (
            <>
              <ArrowDownRight className="w-4 h-4" />
              Deposit {depositAmount} USDC
            </>
          )}
        </button>

        <button
          onClick={handleApproveContract}
          disabled={isApproving || !walletAddress || !depositAmount || parseFloat(depositAmount) <= 0 || !contractInfo}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all relative overflow-hidden"
        >
          <div className="relative flex items-center gap-2">
            {isApproving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <BadgeCheck className="w-4 h-4" />
                Approve {depositAmount} USDC
              </>
            )}
          </div>
        </button>
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
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Value</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ${walletAnalysis.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Current Yield</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {walletAnalysis.currentAPY}% APY
                </span>
              </div>
            </div>

            <div className="bg-slate-100/50 dark:bg-slate-800/30 rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-800 dark:text-white mb-2">Risk Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400">Low Risk</span>
                  </div>
                  <span className="font-medium">{walletAnalysis.riskDistribution.low}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                    <span className="text-slate-600 dark:text-slate-400">Medium Risk</span>
                  </div>
                  <span className="font-medium">{walletAnalysis.riskDistribution.medium}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-slate-600 dark:text-slate-400">High Risk</span>
                  </div>
                  <span className="font-medium">{walletAnalysis.riskDistribution.high}%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100/50 dark:bg-slate-800/30 rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-800 dark:text-white mb-2">Recommendations</h4>
              <div className="space-y-1">
                {walletAnalysis.recommendations.map((rec, index) => (
                  <p key={index} className="text-xs text-slate-600 dark:text-slate-400">• {rec}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staking Opportunities */}
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
                      <p className="text-xs text-slate-600 dark:text-slate-400">{opportunity.description}</p>
                    </div>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {opportunity.apy}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">TVL:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{opportunity.tvl}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Min:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{opportunity.minAmount}</span>
                    </div>
                    <div className="flex items-center justify-between col-span-2">
                      <span className="text-slate-500">Risk Score:</span>
                      <div className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 ${getRiskColor(opportunity.riskScore)}`}>
                        {getRiskIcon(opportunity.riskScore)}
                        {opportunity.riskScore}/100
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOptimizeOpportunity(opportunity)}
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
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Quick Strategies</h3>
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
              onClick={() => onOptimize('safe-yield-strategy')}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 px-3 py-2 rounded text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 transition-all"
            >
              <Shield className="w-3 h-3" />
              Safe Yields
            </button>
            <button
              onClick={() => onOptimize('high-apy-strategy')}
              className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-500/30 px-3 py-2 rounded text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-1 transition-all"
            >
              <Coins className="w-3 h-3" />
              High APY
            </button>
            <button
              onClick={() => onOptimize('auto-optimize-portfolio')}
              className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 px-3 py-2 rounded text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 transition-all col-span-2"
            >
              <Zap className="w-3 h-3" />
              Auto-Optimize Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}