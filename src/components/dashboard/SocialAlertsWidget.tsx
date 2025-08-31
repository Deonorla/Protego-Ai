'use client'

import React, { useState, useEffect } from 'react'
import { 
  MessageSquare, X, ChevronUp, ChevronDown, Bell,
  Users, TrendingUp, AlertTriangle, CheckCircle,
  Shield, Activity, Eye
} from 'lucide-react'

interface SocialAlertsWidgetProps {
  onAnalyze?: (type: string) => void
  onSpellCast?: (actionName: string) => void;
}

interface SocialAlert {
  id: string
  platform: 'telegram' | 'discord' | 'twitter'
  type: 'threat' | 'opportunity' | 'trending' | 'mention'
  title: string
  message: string
  mentions: number
  sentiment: 'positive' | 'negative' | 'neutral'
  timestamp: string
  groupName?: string
  verified?: boolean
}

export const SocialAlertsWidget: React.FC<SocialAlertsWidgetProps> = ({ onAnalyze }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [alerts, setAlerts] = useState<SocialAlert[]>([])
  const [newAlertsCount, setNewAlertsCount] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  // Mock data - replace with actual SEI MCP server calls
  useEffect(() => {
    const mockAlerts: SocialAlert[] = [
      {
        id: '1',
        platform: 'telegram',
        type: 'threat',
        title: 'Scam Alert',
        message: 'Fake "Sei Foundation" bot detected in multiple groups promoting malicious airdrop',
        mentions: 127,
        sentiment: 'negative',
        timestamp: '2 min ago',
        groupName: 'SEI Traders',
        verified: true
      },
      {
        id: '2',
        platform: 'discord',
        type: 'opportunity',
        title: 'New Protocol Launch',
        message: 'Astroport announcing new LP rewards program with 25% APY boost',
        mentions: 45,
        sentiment: 'positive',
        timestamp: '5 min ago',
        groupName: 'DeFi Dragons',
        verified: true
      },
      {
        id: '3',
        platform: 'twitter',
        type: 'trending',
        title: 'Trending Discussion',
        message: 'SEI network upgrade discussions trending with mostly positive sentiment',
        mentions: 892,
        sentiment: 'positive',
        timestamp: '12 min ago',
        verified: false
      }
    ]

    setAlerts(mockAlerts)
    setNewAlertsCount(mockAlerts.length)

    // Simulate new alerts coming in
    const interval = setInterval(() => {
      setNewAlertsCount(prev => prev + Math.floor(Math.random() * 2))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'telegram': return '📱'
      case 'discord': return '🎮'
      case 'twitter': return '🐦'
      default: return '📢'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'threat': return 'text-red-500 bg-red-500/10'
      case 'opportunity': return 'text-emerald-500 bg-emerald-500/10'
      case 'trending': return 'text-blue-500 bg-blue-500/10'
      case 'mention': return 'text-purple-500 bg-purple-500/10'
      default: return 'text-slate-500 bg-slate-500/10'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-3 h-3 text-emerald-500" />
      case 'negative': return <AlertTriangle className="w-3 h-3 text-red-500" />
      case 'neutral': return <Eye className="w-3 h-3 text-slate-500" />
      default: return null
    }
  }

  const handleAlertAction = (alert: SocialAlert) => {
    if (alert.type === 'threat') {
      onAnalyze('threat-protection')
    } else if (alert.type === 'opportunity') {
      onAnalyze('opportunity-analysis')
    } else {
      onAnalyze('market-scan')
    }
  }

  const handleMaraudersScan = () => {
    setIsScanning(true)
    onAnalyze('full-network-scan')
    setTimeout(() => setIsScanning(false), 3000)
  }

  const clearNewAlerts = () => {
    setNewAlertsCount(0)
  }

  return (
    <div className="relative">
      {/* Widget Toggle Button */}
      <button
        onClick={() => {
          setIsExpanded(!isExpanded)
          if (!isExpanded) clearNewAlerts()
        }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 p-3 rounded-full shadow-lg text-white transition-all duration-200 hover:scale-105 relative group"
      >
        <MessageSquare className="w-6 h-6" />
        {newAlertsCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
            {newAlertsCount > 9 ? '9+' : newAlertsCount}
          </div>
        )}
        <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Expanded Widget */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-white">Social Intelligence</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alerts List */}
          <div className="max-h-96 overflow-y-auto">
            <div className="p-2 space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600/50 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">
                      {getPlatformIcon(alert.platform)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${getTypeColor(alert.type)}`}>
                          {alert.type.toUpperCase()}
                        </span>
                        {alert.verified && (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        )}
                        {getSentimentIcon(alert.sentiment)}
                      </div>
                      
                      <h4 className="font-medium text-sm text-slate-800 dark:text-white mb-1">
                        {alert.title}
                      </h4>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {alert.groupName && (
                            <span>{alert.groupName}</span>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {alert.mentions}
                          </div>
                          <span>{alert.timestamp}</span>
                        </div>
                        
                        <button
                          onClick={() => handleAlertAction(alert)}
                          className="opacity-0 group-hover:opacity-100 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs flex items-center gap-1 transition-all font-medium"
                        >
                          <Activity className="w-3 h-3" />
                          Analyze
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 flex gap-2 bg-slate-50/50 dark:bg-slate-800/50">
            <button
              onClick={() => onAnalyze('mute-notifications')}
              className="flex-1 bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 px-3 py-2 rounded text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-all"
            >
              <Bell className="w-4 h-4" />
              Mute All
            </button>
            <button
              onClick={handleMaraudersScan}
              disabled={isScanning}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 px-3 py-2 rounded text-sm font-medium text-white flex items-center justify-center gap-2 transition-all"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Marauder&apos;s Map
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}