'use client'

import React, { useState, useEffect } from 'react'
import { 
  Shield, Bot, Activity, TrendingUp, AlertTriangle, 
  MessageSquare, Users, Eye, Lock, Zap, CheckCircle, 
  Moon, Sun, ArrowUpRight, Search,
  DollarSign, Globe, Briefcase, ArrowRight, Menu, X,
  Home, LayoutDashboard, LineChart, UserCheck, Headphones,
  Star, Heart, Award, Coins, Mail, BarChart3, Layers,
  Target, Cpu, Network, Database, ChevronRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'


function CompleteLandingPage(){
  const [isDark, setIsDark] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [threatCount, setThreatCount] = useState(47832)
  const [isAnimating, setIsAnimating] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [currentSpell, setCurrentSpell] = useState(0)
    const router = useRouter()
  
  const spells = ['Protection', 'Protego', 'Salvio Hexia', 'Fianto Duri', 'Repello Inimicum']
  
    const handleEnterDashboard = () => {
    
    // Navigate to dashboard
    router.push('/dashboard');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setThreatCount(prev => prev + Math.floor(Math.random() * 8) + 3)
        setIsAnimating(false)
      }, 500)
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6)
    }, 4000)
    return () => clearInterval(featureInterval)
  }, [])

  useEffect(() => {
    const spellInterval = setInterval(() => {
      setCurrentSpell(prev => (prev + 1) % spells.length)
    }, 3000)
    return () => clearInterval(spellInterval)
  }, [])

  const ThreatCounter = ({ count }: { count: number }) => (
    <div className={`inline-flex items-center gap-3 ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-100 border-red-300 text-red-600'} border rounded-lg px-4 py-2.5 backdrop-blur-sm`}>
      <div className="relative">
        <div className={`w-2 h-2 ${isDark ? 'bg-red-500' : 'bg-red-500'} rounded-full`}>
          <div className={`absolute inset-0 ${isDark ? 'bg-red-500' : 'bg-red-500'} rounded-full animate-ping`} />
        </div>
      </div>
      <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
      <span className={`${isDark ? 'text-red-400' : 'text-red-600'} font-mono text-sm font-medium`}>
        {count.toLocaleString()} threats blocked today
      </span>
    </div>
  )

  const FeatureCard = ({ icon: Icon, title, description, isActive, gradient }: {
    icon: React.ElementType
    title: string
    description: string
    isActive?: boolean
    gradient: string
  }) => (
    <div className={`group relative ${isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white/90 border-slate-200/60'} backdrop-blur-md border rounded-xl p-6 transition-all duration-500 ${isActive ? 'ring-2 ring-blue-500/50 transform scale-[1.02]' : 'hover:border-blue-500/40'}`}>
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 ${isActive ? 'opacity-5' : ''} rounded-xl transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className={`mb-4 p-3 ${isDark ? 'bg-slate-800/80' : 'bg-slate-100/80'} rounded-lg w-fit group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-3 group-hover:text-blue-400 transition-colors duration-300`}>
          {title}
        </h3>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed text-sm`}>{description}</p>
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradient} opacity-0 group-hover:opacity-100 ${isActive ? 'opacity-50' : ''} rounded-b-xl transition-opacity duration-500`} />
    </div>
  )

  const StatCard = ({ number, label, icon: Icon, trend, color = "blue" }: {
    number: string
    label: string
    icon: React.ElementType
    trend?: string
    color?: string
  }) => {
    const colorClasses: Record<string, string> = {
      blue: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-100 text-blue-600 border-blue-300/50',
      green: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border-emerald-300/50',
      yellow: isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-600 border-amber-300/50',
      purple: isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-100 text-indigo-600 border-indigo-300/50',
      red: isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-100 text-red-600 border-red-300/50'
    }

    return (
      <div className={`${isDark ? 'bg-slate-900/40 border-slate-800/50' : 'bg-white/70 border-slate-200/50'} backdrop-blur-md border rounded-xl p-6 group hover:transform hover:scale-105 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${colorClasses[color]} rounded-lg border`}>
            <Icon className={`w-6 h-6`} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </div>
          )}
        </div>
        <div className={`text-2xl font-bold mb-1 ${colorClasses[color].split(' ')[1]}`}>{number}</div>
        <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm font-medium`}>{label}</div>
      </div>
    )
  }

  const TestimonialCard = ({ name, role, company, avatar, quote, metrics }: {
    name: string
    role: string
    company: string
    avatar: string
    quote: string
    metrics: { label: string; value: string }
  }) => (
    <div className={`${isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white/90 border-slate-200/60'} backdrop-blur-md border rounded-xl p-6 group hover:border-blue-500/30 transition-all duration-300`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div className={`w-14 h-14 rounded-xl ${avatar} flex items-center justify-center text-white font-semibold text-lg shadow-lg`}>
            {name.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'} text-lg`}>{name}</h4>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>{role}</p>
          <div className="flex items-center gap-2">
            <Briefcase className="w-3 h-3 text-blue-400" />
            <span className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'} font-medium`}>{company}</span>
          </div>
        </div>
      </div>
      
      <blockquote className={`${isDark ? 'text-slate-300' : 'text-slate-700'} italic mb-4 text-sm leading-relaxed`}>
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/10">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
          {metrics.value} {metrics.label}
        </div>
      </div>
    </div>
  )

  const features = [
    { icon: Shield, title: "AI Threat Intelligence", description: "Real-time analysis of on-chain activity and social signals across 100+ DeFi communities to identify emerging threats before they impact your portfolio.", gradient: "bg-gradient-to-br from-blue-600 to-cyan-500" },
    { icon: Network, title: "Cross-Platform Security", description: "Unified protection across all major communication platforms with intelligent risk scoring and automated response protocols.", gradient: "bg-gradient-to-br from-indigo-600 to-blue-500" },
    { icon: Target, title: "Automated Yield Optimization", description: "Smart contract analysis and automated rebalancing based on risk-adjusted returns. Move capital to safer protocols when threats are detected.", gradient: "bg-gradient-to-br from-emerald-600 to-teal-500" },
    { icon: Bot, title: "Transaction Pre-screening", description: "AI-powered wallet and contract analysis before any transaction. Get risk assessments and safety recommendations in real-time.", gradient: "bg-gradient-to-br from-purple-600 to-indigo-500" },
    { icon: Database, title: "Emergency Asset Protection", description: "Automatic asset protection protocols that activate during critical threats. Instant migration to secure vaults with governance token conversion.", gradient: "bg-gradient-to-br from-red-600 to-pink-500" },
    { icon: Cpu, title: "DeFi Protocol Analytics", description: "Continuous monitoring of protocol health, liquidity depth, and smart contract security. Only verified safe protocols with sustainable yields.", gradient: "bg-gradient-to-br from-amber-600 to-orange-500" }
  ]

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} relative overflow-hidden`}>
      {/* Advanced background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-indigo-500/3 to-purple-500/3" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 ${isDark ? 'bg-slate-950/90' : 'bg-white/90'} backdrop-blur-lg border-b ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Protego AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`hover:${isDark ? 'text-blue-400' : 'text-blue-600'} transition-colors font-medium`}>Features</a>
            <a href="#security" className={`hover:${isDark ? 'text-blue-400' : 'text-blue-600'} transition-colors font-medium`}>Security</a>
            <a href="#testimonials" className={`hover:${isDark ? 'text-blue-400' : 'text-blue-600'} transition-colors font-medium`}>Testimonials</a>
            <a href="#pricing" className={`hover:${isDark ? 'text-blue-400' : 'text-blue-600'} transition-colors font-medium`}>Pricing</a>
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition-colors`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <ThreatCounter count={threatCount} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="relative">
                AI-Powered DeFi Security
              </span>
              <span className="block bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                & Yield Optimization
              </span>
            </h1>
            
            <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-8 max-w-3xl mx-auto leading-relaxed`}>
              Advanced AI security that protects your DeFi positions while automatically optimizing yields. 
              Real-time threat detection, social intelligence monitoring, and emergency asset protection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                 onClick={() => {
                  handleEnterDashboard()
                }}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Shield className="w-5 h-5" />
                Access Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className={`px-8 py-4 border-2 ${isDark ? 'border-slate-600 hover:border-blue-400 hover:bg-blue-400/5' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-500/5'} rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2`}>
                <Eye className="w-5 h-5" />
                View Demo
              </button>
            </div>

            <div className="flex justify-center">
              <div className={`flex items-center gap-3 ${isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-600 bg-emerald-100 border-emerald-300'} border rounded-lg px-4 py-2 backdrop-blur-sm`}>
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">All Security Protocols Active</span>
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`relative z-10 py-16 border-y ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard number="3.2M+" label="Security Scans" icon={Shield} trend="+12%" />
            <StatCard number="247" label="Protocols Monitored" icon={Network} color="green" trend="+8%" />
            <StatCard number="$1.4B" label="Assets Protected" icon={Lock} color="blue" trend="+24%" />
            <StatCard number="31.7%" label="Avg APY Optimized" icon={TrendingUp} color="yellow" trend="+15%" />
            <StatCard number="99.98%" label="Uptime" icon={Zap} color="purple" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Advanced Security Architecture
            </h2>
            <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-3xl mx-auto`}>
              Enterprise-grade AI protection that learns from global threat patterns and automatically optimizes your DeFi strategy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isActive={activeFeature === index}
                gradient={feature.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Security Deep Dive */}
      <section id="security" className={`relative z-10 py-24 ${isDark ? 'bg-slate-900/20' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Multi-Layer{' '}
                <span className="inline-block min-w-[200px] text-left">
                  <span 
                    key={currentSpell}
                    className="inline-block animate-fade-in-up bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  >
                    {spells[currentSpell]}
                  </span>
                </span>
                <span className={`block text-2xl font-normal mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Built for institutional-grade security
                </span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Real-Time Threat Intelligence</h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      AI monitors 100+ data sources including social media, on-chain activity, and protocol governance to identify threats before they materialize.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg mt-1">
                    <Target className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Smart Contract Auditing</h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      Every transaction is pre-screened with ML models trained on historical exploit patterns and vulnerability databases.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg mt-1">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Automated Response Protocols</h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                      When threats are detected, assets are automatically moved to secure vaults while maintaining yield optimization strategies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${isDark ? 'bg-slate-900/50' : 'bg-white/80'} backdrop-blur-md rounded-2xl p-8 border ${isDark ? 'border-slate-800/50' : 'border-slate-200/50'}`}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400">Security Score</span>
                  <span className="text-2xl font-bold text-emerald-400">98.7%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full" style={{width: '98.7%'}} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">24/7</div>
                    <div className="text-sm text-slate-400">Monitoring</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">&lt;100ms</div>
                    <div className="text-sm text-slate-400">Response Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">Zero</div>
                    <div className="text-sm text-slate-400">False Positives</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">5-Layer</div>
                    <div className="text-sm text-slate-400">Protection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by DeFi Leaders
            </h2>
            <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
              From individual traders to institutional funds - see why professionals choose Protego AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Elena Rodriguez"
              role="Head of DeFi Strategy"
              company="Axiom Capital"
              avatar="bg-gradient-to-br from-blue-500 to-indigo-600"
              quote="Protego AI identified a contract vulnerability that would have cost us $2.3M. The automated response moved our funds to safety before the exploit went live."
              metrics={{ label: "assets protected", value: "$45M" }}
            />
            <TestimonialCard 
              name="Marcus Chen"
              role="Senior Risk Analyst"
              company="Blockchain Ventures"
              avatar="bg-gradient-to-br from-emerald-500 to-teal-600"
              quote="The social intelligence feature is game-changing. We caught three rug pulls in their planning stages through Telegram monitoring."
              metrics={{ label: "threats blocked", value: "127" }}
            />
            <TestimonialCard 
              name="Sarah Kim"
              role="Portfolio Manager"
              company="DeFi Strategies LLC"
              avatar="bg-gradient-to-br from-purple-500 to-pink-600"
              quote="Automated yield optimization while maintaining security is exactly what institutional investors need. ROI improved 34% since implementation."
              metrics={{ label: "yield optimized", value: "34%" }}
            />
            <TestimonialCard 
              name="James Wilson"
              role="CTO"
              company="MetaFund Protocol"
              avatar="bg-gradient-to-br from-amber-500 to-orange-600"
              quote="The API integration was seamless. Now our entire fund operates with real-time threat intelligence built into every transaction."
              metrics={{ label: "integrations", value: "15" }}
            />
            <TestimonialCard 
              name="Dr. Lisa Wang"
              role="Quantitative Analyst"
              company="Horizon Trading"
              avatar="bg-gradient-to-br from-cyan-500 to-blue-600"
              quote="The machine learning models are incredibly sophisticated. We've reduced our risk exposure by 67% while maintaining alpha generation."
              metrics={{ label: "risk reduction", value: "67%" }}
            />
            <TestimonialCard 
              name="Alex Thompson"
              role="Fund Manager"
              company="Progressive Yield"
              avatar="bg-gradient-to-br from-rose-500 to-red-600"
              quote="24/7 monitoring gives us confidence to operate globally. The emergency protocols have saved us multiple times during market volatility."
              metrics={{ label: "uptime", value: "99.98%" }}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Professional-Grade Security Plans
            </h2>
            <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
              Comprehensive protection for every portfolio size, from individual traders to institutional funds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white/90 border-slate-200/60'} backdrop-blur-md border rounded-2xl p-8 relative transition-all duration-300 hover:border-blue-500/40`}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <div className="text-4xl font-bold text-blue-400 mb-1">$99</div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>per month • Individual traders</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Real-time threat monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Social intelligence across 3 platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Automated yield optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Transaction pre-screening</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Emergency asset protection</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Email & chat support</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Start Protection
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className={`${isDark ? 'bg-slate-900/60 border-emerald-500/50' : 'bg-white/90 border-emerald-300/50'} backdrop-blur-md border-2 rounded-2xl p-8 relative transform scale-105 shadow-2xl`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-emerald-400 mb-1">$299</div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>per month • Advanced protection</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Everything in Professional +</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Advanced AI threat models</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Custom risk parameters</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Multi-wallet portfolio management</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">API access & webhooks</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Dedicated account manager</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">24/7 priority support</span>
                </div>
              </div>
              
              <button 
                onClick={handleEnterDashboard}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Get Enterprise
              </button>
            </div>

            {/* Institutional Plan */}
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white/90 border-slate-200/60'} backdrop-blur-md border rounded-2xl p-8 relative transition-all duration-300 hover:border-purple-500/40`}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Institutional</h3>
                <div className="text-4xl font-bold text-purple-400 mb-1">Custom</div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Enterprise solutions</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Everything in Enterprise +</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Custom AI model training</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">White-label solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">On-premises deployment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">Compliance & reporting tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">SLA guarantees</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2">
                <Award className="w-5 h-5" />
                Contact Sales
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
              All plans include 99.98% uptime SLA, enterprise-grade security, and access to our security research team
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Secure Your DeFi Future
          </h2>
          <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-12`}>
            Join institutional investors and professional traders who trust Protego AI to protect and optimize their DeFi portfolios. 
            Advanced security meets intelligent yield optimization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={handleEnterDashboard}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <Shield className="w-5 h-5" />
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className={`px-8 py-4 border-2 ${isDark ? 'border-slate-600 hover:border-blue-400 hover:bg-blue-400/5' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-500/5'} rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2`}>
              <MessageSquare className="w-5 h-5" />
              Schedule Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${isDark ? 'bg-slate-900/40 border-slate-800/50' : 'bg-white/70 border-slate-200/50'} backdrop-blur-md border rounded-xl p-6 text-center`}>
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Expert Support</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Get guidance from DeFi security experts
              </p>
            </div>
            <div className={`${isDark ? 'bg-slate-900/40 border-slate-800/50' : 'bg-white/70 border-slate-200/50'} backdrop-blur-md border rounded-xl p-6 text-center`}>
              <Globe className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Global Coverage</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                24/7 monitoring across all major protocols
              </p>
            </div>
            <div className={`${isDark ? 'bg-slate-900/40 border-slate-800/50' : 'bg-white/70 border-slate-200/50'} backdrop-blur-md border rounded-xl p-6 text-center`}>
              <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Enterprise Security</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Bank-grade encryption and compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${isDark ? 'border-slate-800/50 bg-slate-950/80' : 'border-slate-200/50 bg-white/80'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Shield className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Protego AI
              </span>
            </div>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6 max-w-2xl mx-auto`}>
              Advanced AI-powered security and yield optimization for the decentralized finance ecosystem. 
              Protecting digital assets with institutional-grade intelligence.
            </p>
            <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
              © 2025 Protego AI. All rights reserved. 
              <span className="inline-flex items-center gap-1 ml-2">
                Built with <Heart className="w-4 h-4 text-red-400" /> for DeFi security
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CompleteLandingPage;