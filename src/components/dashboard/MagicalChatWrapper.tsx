'use client'

import React, { createContext, useState, useEffect } from 'react'
import { 
  Shield, AlertTriangle, TrendingUp, Activity, Sparkles, 
  Star, Wand2, Eye, Zap, Users, MessageSquare, ArrowRight,
  Bell, DollarSign, Home, Settings, Lock, CheckCircle, Wallet,
  ChevronDown, Copy, ExternalLink, LogOut
} from 'lucide-react'
import { ThreatDetectionPanel } from './ThreatDetectionPanel'
import { YieldOptimizationSidebar } from './YeildOptimizationsSidebar'
import { SocialAlertsWidget } from './SocialAlertsWidget'
import { Logo } from '../logo'

interface SecurityDashboardWrapperProps {
  children: React.ReactNode
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

export const WalletContext = createContext(null);

export const SecurityDashboardWrapper: React.FC<SecurityDashboardWrapperProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)
  const [securityParticles, setSecurityParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [currentAction, setCurrentAction] = useState('')
  const [threatsBlocked, setThreatsBlocked] = useState(2847)
  const [isSecurityActive, setIsSecurityActive] = useState(false)
  const [protectionLevel, setProtectionLevel] = useState(98.7)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [walletType, setWalletType] = useState('')
  const [showWalletDropdown, setShowWalletDropdown] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [balance, setBalance] = useState('0.00')


  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
      refreshBalance(accounts[0]);
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    disconnectWallet();
  };

  const refreshBalance = async (address) => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const balanceWei = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        const balanceEth = (parseInt(balanceWei, 16) / Math.pow(10, 18)).toFixed(4);
        setBalance(balanceEth);
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setCurrentAction('Connecting to MetaMask');
      
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      setWalletAddress(address);
      setWalletType('metamask');
      setIsWalletConnected(true);
      await refreshBalance(address);

      setCurrentAction('Protego Totalum - Wallet Protected!');
      setTimeout(() => setCurrentAction(''), 2000);

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
      console.error('Wallet connection error:', error);
      let errorMessage = 'Connection Failed';
      
      if (error.message.includes('not installed')) {
        errorMessage = 'MetaMask Not Installed';
      } else if (error.code === 4001) {
        errorMessage = 'Connection Rejected';
      } else if (error.message.includes('No accounts')) {
        errorMessage = 'No Accounts Found';
      }
      
      setCurrentAction(errorMessage);
      setTimeout(() => setCurrentAction(''), 3000);
    }
  };

  const disconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
    
    setIsWalletConnected(false);
    setWalletAddress('');
    setWalletType('');
    setBalance('0.00');
    setCurrentAction('Finite Incantatem - Wallet Disconnected');
    setTimeout(() => setCurrentAction(''), 2000);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setWalletType('metamask');
            setIsWalletConnected(true);
            refreshBalance(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  const walletState = {
    isWalletConnected,
    walletAddress,
    walletType,
    balance,
    currentAction,
    connectWallet,
    disconnectWallet,
  };

  // Generate subtle security indicators
  const generateSecurityParticles = () => {
    const newParticles = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4
    }))
    setSecurityParticles(newParticles)
  }

  useEffect(() => {
    generateSecurityParticles()
    const particleInterval = setInterval(generateSecurityParticles, 15000)
    return () => clearInterval(particleInterval)
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCurrentAction('Address Copied!')
    setTimeout(() => setCurrentAction(''), 1500)
  }

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getWalletIcon = (type: string) => {
    return '🦊' // Only MetaMask now
  }

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
            setWalletType('metamask')
            setIsWalletConnected(true)
            refreshBalance(accounts[0])
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error)
        }
      }
    }
    
    checkConnection()
  }, [])

  // Update threat count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatsBlocked(prev => prev + Math.floor(Math.random() * 2) + 1)
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  const activateProtection = (actionName: string) => {
    setCurrentAction(actionName)
    setIsSecurityActive(true)
    // Animate protection level
    const startLevel = protectionLevel
    const targetLevel = Math.min(99.9, startLevel + Math.random() * 0.5)
    let current = startLevel
    const step = (targetLevel - startLevel) / 20
    
    const animate = () => {
      current += step
      if (current < targetLevel) {
        setProtectionLevel(current)
        requestAnimationFrame(animate)
      } else {
        setProtectionLevel(targetLevel)
      }
    }
    animate()
    
    setTimeout(() => {
      setIsSecurityActive(false)
      setCurrentAction('')
    }, 3000)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} relative overflow-hidden`}>
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 via-slate-500/2 to-emerald-600/3" />
        {securityParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Security Action Notification */}
      {currentAction && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-3 shadow-xl animate-fade-in-down border border-blue-400/30">
            <Shield className="w-5 h-5" />
            <span className="font-medium">🛡️ {currentAction}</span>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2" />
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav 
        className={`fixed top-0 w-full z-40 ${isDark ? 'bg-slate-950/95' : 'bg-white/95'} backdrop-blur-md border-b ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'}`}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setShowWalletDropdown(false)
            setShowAccountDropdown(false)
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
                <Logo className={` ${isDark ? 'text-blue-400' : 'text-blue-600'}`} width={100} height={32100} />
            
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Protego
              </span>
            
          </div>

          {/* Security Status & Wallet */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'} border rounded-lg px-3 py-2`}>
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {protectionLevel.toFixed(1)}% Protected
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'} border rounded-lg px-3 py-2`}>
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-mono">
                {threatsBlocked.toLocaleString()} secured
              </span>
            </div>

            {/* Wallet Connection */}
            {!isWalletConnected ? (
              <button 
                onClick={connectWallet}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isDark ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 border-blue-500/30 text-white' : 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 border-blue-400/30 text-white'} transition-all duration-200 font-medium`}
              >
                <Wallet className="w-4 h-4" />
                <span>Authorize agent</span>
              </button>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'} transition-colors`}
                >
                  <div className="text-left">
                    <div className="font-mono text-sm">{formatAddress(walletAddress)}</div>
                  </div>
                </button>

                {showAccountDropdown && (
                  <div className={`absolute top-full right-0 mt-2 w-64 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-lg shadow-xl z-50`}>
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🦊</span>
                        <span className="font-medium">MetaMask</span>
                      </div>
                      <div className="font-mono text-sm mb-1 break-all">{walletAddress}</div>
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Balance: {balance} ETH
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={copyAddress}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-800'} transition-colors`}
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Address</span>
                      </button>
                      <button
                        onClick={() => window.open(`https://etherscan.io/address/${walletAddress}`, '_blank')}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-800'} transition-colors`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View on Etherscan</span>
                      </button>
                      <button
                        onClick={disconnectWallet}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button 
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'} transition-all duration-200`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className="pt-16 flex h-screen">
        {/* Security Monitoring Panel */}
        <div className={`w-80 border-r ${isDark ? 'border-slate-800/50 bg-slate-900/30' : 'border-slate-200/50 bg-white/30'} backdrop-blur-sm`}>
          <ThreatDetectionPanel onSpellCast={activateProtection} />
        </div>

        {/* Main Interface */}
        <div className="flex-1 flex flex-col relative">
          {/* Subtle professional overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/1 to-transparent pointer-events-none" />
          
          {/* Main content area */}
          <div className="relative z-10 flex-1 flex flex-col">
            <WalletContext.Provider value={walletState}>
            {children}
             </WalletContext.Provider>
          </div>
        </div>

        {/* Yield Optimization Panel */}
        <div className={`w-80 border-l ${isDark ? 'border-slate-800/50 bg-slate-900/30' : 'border-slate-200/50 bg-white/30'} backdrop-blur-sm`}>
          <YieldOptimizationSidebar onSpellCast={activateProtection} />
        </div>
      </div>

      {/* Social Alerts Widget */}
      <div className="fixed bottom-6 right-6 z-30">
        <SocialAlertsWidget onSpellCast={activateProtection} />
      </div>
    </div>
  )
}