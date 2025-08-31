'use client'

import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, Shield, Eye, Activity, Clock, Users, 
  MessageSquare, ExternalLink, Search, Scan,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react'

interface ThreatDetectionPanelProps {
  onSecurityAction?: (action: string) => void;
    onSpellCast?: (actionName: string) => void;
}

interface Threat {
  id: string
  type: 'contract' | 'social' | 'transaction'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  source: string
  timestamp: string
  action?: string
}

interface SocialAlert {
  id: string
  platform: 'telegram' | 'discord' | 'twitter'
  message: string
  mentions: number
  timestamp: string
  riskLevel: 'safe' | 'warning' | 'danger'
}

export const ThreatDetectionPanel: React.FC<ThreatDetectionPanelProps> = ({ onSecurityAction }) => {
  const [threats, setThreats] = useState<Threat[]>([])
  const [socialAlerts, setSocialAlerts] = useState<SocialAlert[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [isCasting, setIsCasting] = useState(false)

  // Mock data for demonstration - replace with actual SEI MCP server calls
  useEffect(() => {
    const mockThreats: Threat[] = [
      {
        id: '1',
        type: 'contract',
        severity: 'critical',
        title: 'Malicious Contract Detected',
        description: 'High-risk DeFi contract with suspicious drain functions',
        source: '0x742d35Cc6e8A2B3C456E...a8F9',
        timestamp: '2 min ago',
        action: 'block-contract'
      },
      {
        id: '2',
        type: 'social',
        severity: 'high',
        title: 'Coordinated Shill Campaign',
        description: 'Bot network promoting fake yield farming protocol',
        source: 'Telegram: DeFi Wizards',
        timestamp: '5 min ago',
        action: 'investigate-social'
      },
      {
        id: '3',
        type: 'transaction',
        severity: 'medium',
        title: 'Unusual Transaction Pattern',
        description: 'Large wallet movements suggesting possible rug pull',
        source: 'On-chain Analysis',
        timestamp: '12 min ago',
        action: 'monitor-wallet'
      }
    ]

    const mockSocialAlerts: SocialAlert[] = [
      {
        id: '1',
        platform: 'telegram',
        message: 'NEW DEFI GEM 🚀 1000x POTENTIAL',
        mentions: 50,
        timestamp: '1 min ago',
        riskLevel: 'danger'
      },
      {
        id: '2',
        platform: 'discord',
        message: 'Astroport LP farming looks legit',
        mentions: 15,
        timestamp: '8 min ago',
        riskLevel: 'safe'
      }
    ]

    setThreats(mockThreats)
    setSocialAlerts(mockSocialAlerts)
  }, [])

  // Function to fetch threats from SEI MCP server
  const fetchThreats = async () => {
    setIsScanning(true)
    try {
      // Replace with actual SEI MCP server endpoint
      const response = await fetch('/api/sei-mcp/threats')
      const data = await response.json()
      setThreats(data.threats || [])
    } catch (error) {
      console.error('Failed to fetch threats:', error)
    }
    setIsScanning(false)
  }

  // Harry Potter reference - Homenum Revelio spell
  const castHomenuRevelio = () => {
    setIsCasting(true)
    onSecurityAction('homenum-revelio')
    
    // Create magical scanning animation
    setTimeout(() => {
      fetchThreats()
      setIsCasting(false)
    }, 2500)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20'
      default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-500/10 dark:border-slate-500/20'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'low': return <Eye className="w-4 h-4 text-blue-500" />
      default: return <CheckCircle className="w-4 h-4 text-slate-500" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'danger': return 'text-red-500'
      case 'warning': return 'text-yellow-500'
      case 'safe': return 'text-emerald-500'
      default: return 'text-slate-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'telegram': return '📱'
      case 'discord': return '🎮'
      case 'twitter': return '🐦'
      default: return '📢'
    }
  }

  const handleThreatAction = (threat: Threat) => {
    onSecurityAction(threat.action || 'investigate')
  }

  return (
    <div className="h-full flex flex-col bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            {isCasting && (
              <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Threat Detection</h2>
        </div>

        <button
          onClick={castHomenuRevelio}
          disabled={isScanning || isCasting}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all relative overflow-hidden group"
        >
          {isCasting && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 animate-pulse" />
          )}
          <div className="relative flex items-center gap-2">
            {isScanning || isCasting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                {isCasting ? 'Casting Homenum Revelio...' : 'Scanning...'}
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                Cast Homenum Revelio
              </>
            )}
          </div>
        </button>
      </div>

      {/* Threat Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Active Threats ({threats.length})
          </h3>

          <div className="space-y-3">
            {threats.map((threat) => (
              <div
                key={threat.id}
                className={`p-4 rounded-lg border backdrop-blur-sm ${getSeverityColor(threat.severity)} relative overflow-hidden group transition-all hover:shadow-md`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(threat.severity)}
                      <h4 className="font-semibold text-sm">{threat.title}</h4>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getSeverityColor(threat.severity)}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm opacity-80 mb-3">{threat.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Clock className="w-3 h-3" />
                      {threat.timestamp}
                    </div>
                    
                    <button
                      onClick={() => handleThreatAction(threat)}
                      className="bg-white/20 dark:bg-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-700/70 px-3 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all border border-white/20 dark:border-slate-600/50"
                    >
                      <Activity className="w-3 h-3" />
                      Investigate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Alerts */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/50">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Social Intelligence ({socialAlerts.length})
          </h3>

          <div className="space-y-2">
            {socialAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-lg">{getPlatformIcon(alert.platform)}</span>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 dark:text-slate-300">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Users className="w-3 h-3" />
                        {alert.mentions} mentions
                      </div>
                      <div className={`text-xs font-medium ${getRiskColor(alert.riskLevel)}`}>
                        {alert.riskLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}