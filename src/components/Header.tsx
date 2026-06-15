import React, { useState } from 'react';
import { Gamepad2, Copy, Check, User, BarChart3, ShoppingBag, Globe, Key } from 'lucide-react';
import { ServerStats } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  serverStats: ServerStats | null;
  loggedInUser: string | null;
  onLogout: () => void;
}

export function Header({ activeTab, setActiveTab, serverStats, loggedInUser, onLogout }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const ip = serverStats 
    ? (serverStats.serverPort === 25565 ? serverStats.serverIp : `${serverStats.serverIp}:${serverStats.serverPort}`) 
    : "72.62.119.240:29667";

  const copyIp = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header id="app-header" className="border-b border-[#ffffff]/10 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]">D</div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase text-white leading-none">Diamant<span className="text-indigo-500">SMP</span></h1>
              <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase">Український сервер</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-2">
            <button
               id="nav-home"
               onClick={() => setActiveTab('home')}
               className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all border ${
                 activeTab === 'home'
                   ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                   : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
               }`}
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Головна</span>
              </div>
            </button>
            <button
               id="nav-shop"
               onClick={() => setActiveTab('shop')}
               className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all border ${
                 activeTab === 'shop'
                   ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                   : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
               }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Магазин</span>
              </div>
            </button>
            <button
               id="nav-stats"
               onClick={() => setActiveTab('stats')}
               className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all border ${
                 activeTab === 'stats'
                   ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                   : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
               }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Статистика</span>
              </div>
            </button>
            <button
               id="nav-cabinet"
               onClick={() => setActiveTab('cabinet')}
               className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all border ${
                 activeTab === 'cabinet'
                   ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                   : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
               }`}
            >
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5" />
                <span>Кабінет</span>
              </div>
            </button>
          </nav>

          {/* IP & Right Controls */}
          <div className="flex items-center space-x-3">
            
            {/* IP copier */}
            <div 
              id="ip-copier-header"
              onClick={copyIp}
              className="bg-white/5 border border-white/10 rounded-xl p-1.5 px-3 flex items-center space-x-2 hover:border-indigo-500/40 cursor-pointer transition-all active:scale-95 group"
              title="Натисніть щоб скопіювати IP"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <div className="text-left">
                <p className="text-[8px] font-mono text-gray-500 uppercase leading-none">Адреса сервера</p>
                <p className="text-[11px] font-mono font-bold tracking-wide text-white group-hover:text-indigo-300 leading-tight transition-colors">
                  {ip}
                </p>
              </div>
              <div className="pl-1.5 border-l border-white/10 py-1">
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                )}
              </div>
            </div>

            {/* Cabinet quick entry */}
            {loggedInUser ? (
              <div className="flex items-center space-x-2 p-1 bg-indigo-600/5 hover:bg-indigo-600/10 border border-indigo-500/20 rounded-xl pl-3 transition-all">
                <div className="text-right">
                  <p className="text-[8px] text-indigo-400 font-mono leading-none uppercase tracking-widest font-black">Гравець</p>
                  <p className="font-mono text-xs font-bold text-white pr-1">{loggedInUser}</p>
                </div>
                <button 
                  onClick={() => setActiveTab('cabinet')}
                  className="p-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-mono transition-all font-bold uppercase tracking-wider"
                >
                  Кабінет
                </button>
              </div>
            ) : (
              <button
                id="header-btn-login"
                onClick={() => setActiveTab('cabinet')}
                className="bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Ввійти</span>
              </button>
            )}

          </div>

        </div>
      </div>
      
      {/* Mobile Nav Subbar */}
      <div className="md:hidden flex overflow-x-auto border-t border-[#ffffff]/10 bg-[#0a0a0c] px-2 py-1.5 space-x-1 hide-scrollbar">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 min-w-[80px] py-1.5 text-center font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'home' ? 'bg-indigo-600/10 text-indigo-400 font-bold' : 'text-gray-400'
          }`}
        >
          Головна
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 min-w-[80px] py-1.5 text-center font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'shop' ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-400'
          }`}
        >
          Магазин
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 min-w-[80px] py-1.5 text-center font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'stats' ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-400'
          }`}
        >
          Топ
        </button>
        <button
          onClick={() => setActiveTab('cabinet')}
          className={`flex-1 min-w-[80px] py-1.5 text-center font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'cabinet' ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-400'
          }`}
        >
          Кабінет
        </button>
      </div>
    </header>
  );
}
