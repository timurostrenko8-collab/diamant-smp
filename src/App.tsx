import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeTab } from './components/HomeTab';
import { ShopTab } from './components/ShopTab';
import { StatsTab } from './components/StatsTab';
import { CabinetTab } from './components/CabinetTab';

import { ServerStats, Player, Order, ChatMessage } from './types';
import { Gamepad2, Copy, Check, ExternalLink, Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTabTab] = useState('home');
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Local active user session state
  const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
    return localStorage.getItem('smaragd_smp_nickname') || null;
  });
  const [playerProfile, setPlayerProfile] = useState<Player | null>(null);

  // Copy IP indicator for the footer/main elements
  const [copied, setCopied] = useState(false);
  
  // Custom Toast notification states for server side events
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. POLLING SYNC ACTIONS WITH THE EXPRESS BACKEND API
  const fetchServerState = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('API Sync issue');
      const data = await res.json();
      
      setServerStats(data.stats);
      setPlayers(data.players);
      setOrders(data.orders);
      setChatMessages(data.chat);

      // If registered player is online, update their quick profile stats
      if (loggedInUser) {
        const matchingProfile = data.players.find((p: Player) => p.name.toLowerCase() === loggedInUser.toLowerCase());
        if (matchingProfile) {
          setPlayerProfile(matchingProfile);
        }
      }
    } catch (err) {
      console.error('Error fetching server state: ', err);
    }
  };

  useEffect(() => {
    fetchServerState();
    
    // Poll stats and chat logs every 5 seconds for absolute real-time immersion
    const interval = setInterval(() => {
      fetchServerState();
    }, 5000);

    return () => clearInterval(interval);
  }, [loggedInUser]);

  // LOGIN FLOW (Register or login with only Nickname inside memory DB)
  const handleLogin = async (nickname: string) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Не вдалося увійти.');
      }

      localStorage.setItem('smaragd_smp_nickname', data.player.name);
      setLoggedInUser(data.player.name);
      setPlayerProfile(data.player);
      showToast(`Вітаємо у кабінеті, ${data.player.name}! Ваша статистика синхронізована.`, 'success');
      setActiveTabTab('cabinet');
    } catch (err: any) {
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smaragd_smp_nickname');
    setLoggedInUser(null);
    setPlayerProfile(null);
    showToast('Ви успішно вийшли з особистого кабінету.', 'info');
  };

  // SEND WEBPAGE TO MINECRAFT CHAT MESSAGE
  const handleSendMessage = async (text: string) => {
    if (!loggedInUser) return;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: loggedInUser, text })
      });
      if (res.ok) {
        fetchServerState(); // immediately poll refresh chat logs
        showToast('Повідомлення успішно відправлено у гру!', 'success');
      }
    } catch (err) {
      showToast('Помилка надсилання повідомлення.', 'error');
    }
  };

  // COMPLETE SIMULATED PAYMENT FOR GOODS IN STORE
  const handlePurchaseComplete = async (details: {
    nickname: string;
    itemId: string;
    itemName: string;
    itemCategory: 'ranks' | 'items';
    price: number;
    paymentMethod: string;
  }) => {
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      
      const data = await res.json();
      if (res.ok) {
        // If purchased for currently logged-in player, synchronize profile balances right away
        if (loggedInUser && loggedInUser.toLowerCase() === details.nickname.toLowerCase()) {
          setPlayerProfile(data.player);
        }
        fetchServerState(); // Refresh overall transactions
        showToast(`Покупка ${details.itemName} успішна! Ранг/ресурси видано у гру.`, 'success');
      } else {
        throw new Error(data.error || 'Помилка бранч-мережі');
      }
    } catch (err: any) {
      showToast(err.message || 'Помилка платіжного запиту.', 'error');
      throw err;
    }
  };

  // EXCHANGE DONOR SMARAGDS TO IN-GAME COINS
  const handleExchangeSmaragds = async (amount: number) => {
    if (!loggedInUser) return;
    try {
      const res = await fetch('/api/profile/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: loggedInUser, donorAmount: amount })
      });
      const data = await res.json();
      if (res.ok) {
        setPlayerProfile(data.player);
        fetchServerState();
        showToast(`Успішно нараховано +${amount * 100} коїнів у гру!`, 'success');
      } else {
        throw new Error(data.error || 'Помилка обміну');
      }
    } catch (err: any) {
      showToast(err.message || 'Не вдалося виконати обмін.', 'error');
      throw err;
    }
  };

  const copyIp = () => {
    const ip = serverStats 
      ? (serverStats.serverPort === 25565 ? serverStats.serverIp : `${serverStats.serverIp}:${serverStats.serverPort}`) 
      : "72.62.119.240:29667";
    navigator.clipboard.writeText(ip);
    setCopied(true);
    showToast('IP адресу скопійовано у буфер обміну!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Active view router selector
  const renderTabContent = () => {
    switch (activeTab) {
      case 'shop':
        return (
          <ShopTab
            loggedInUser={loggedInUser}
            onPurchaseComplete={handlePurchaseComplete}
            players={players}
          />
        );
      case 'stats':
        return (
          <StatsTab
            serverStats={serverStats}
            players={players}
          />
        );
      case 'cabinet':
        return (
          <CabinetTab
            loggedInUser={loggedInUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            playerProfile={playerProfile}
            onExchangeSmaragds={handleExchangeSmaragds}
            onSendChatMessage={handleSendMessage}
          />
        );
      default:
        return (
          <HomeTab
            serverStats={serverStats}
            chatMessages={chatMessages}
            onlinePlayers={players}
            loggedInUser={loggedInUser}
            onSendMessage={handleSendMessage}
            setActiveTab={setActiveTabTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between">
      
      {/* Background aesthetics coordinate grids */}
      <div className="absolute inset-0 coords-grid opacity-[0.03] pointer-events-none" />

      {/* Header element */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTabTab}
        serverStats={serverStats}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      {/* Floating alert toasts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-sm w-full select-none pointer-events-none">
          <div className={`p-4 rounded-xl border flex items-center space-x-3 shadow-2xl ${
            toast.type === 'success' ? 'bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981]' :
            toast.type === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-400' :
            'bg-blue-500/10 border-blue-500/40 text-blue-400'
          }`}>
            <Sparkles className="w-5 h-5 shrink-0" />
            <p className="font-mono text-xs font-semibold leading-normal">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Main page stage */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 z-10 w-full" id="master-stage">
        {renderTabContent()}
      </main>

      {/* Footer view */}
      <footer className="border-t border-mine-border bg-mine-darker py-10 z-10 relative">
        <div className="absolute inset-0 coords-grid opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 relative">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">💎</span>
              <span className="font-mono font-bold tracking-tight text-white">Diamant SMP</span>
            </div>
            <p className="text-xs text-gray-400 leading-normal max-w-sm">
              Diamant SMP — це крафтовий український Майнкрафт сервер, призначений для чистого виживання без грифінгу. Ми створюємо ідеальні умови для творчості, кооперації та чистої Vanilla гри.
            </p>
            <p className="text-[10px] text-gray-500 font-mono">
              © {new Date().getFullYear()} Diamant SMP. Усі права захищені. Ми жодним чином не пов'язані з Mojang AB або Microsoft Corporation.
            </p>
          </div>

          {/* Quick connections IP widget inside footer */}
          <div className="md:col-span-4 space-y-3 font-mono">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Підключення</p>
            
            <div 
              onClick={copyIp}
              className="bg-mine-card/80 border border-mine-border hover:border-indigo-500/40 p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors active:scale-98 group"
            >
              <div className="flex items-center space-x-2">
                <Gamepad2 className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-[8px] text-gray-500 uppercase leading-none">Адреса сервера</p>
                  <p className="text-xs text-white font-bold tracking-wide group-hover:text-indigo-300">
                    {serverStats ? (serverStats.serverPort === 25565 ? serverStats.serverIp : `${serverStats.serverIp}:${serverStats.serverPort}`) : "72.62.119.240:29667"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-mine-border p-1 rounded px-2 text-gray-400 font-bold">
                {copied ? "Готово!" : "Копіювати"}
              </span>
            </div>

            <p className="text-[10px] text-gray-500 leading-normal">
              Потрібна оригінальна ліцензійна копія гри або лаунчер, що підтримує мережеве підключення версії 1.20+.
            </p>
          </div>

          {/* Useful references links */}
          <div className="md:col-span-3 space-y-3 font-mono">
            <p className="text-xs font-bold uppercase tracking-widest text-white">Корисні посилання</p>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a href="#discord" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>💬 Офіційний Discord</span>
                  <ExternalLink className="w-3 h-3 text-gray-600" />
                </a>
              </li>
              <li>
                <a href="#telegram" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>📢 Telegram Канал новин</span>
                  <ExternalLink className="w-3 h-3 text-gray-600" />
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>🚑 Технічна підтримка 24/7</span>
                  <ExternalLink className="w-3 h-3 text-gray-600" />
                </a>
              </li>
            </ul>

            <div className="pt-2 flex items-center space-x-1.5 text-[10px] text-gray-500">
              <span>Зроблено з</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span>для української спільноти</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
