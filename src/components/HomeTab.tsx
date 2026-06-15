import React, { useState } from 'react';
import { Gamepad2, Shield, Users, MessageSquare, ArrowRight, Zap, Target, BookOpen, Clock } from 'lucide-react';
import { ServerStats, ChatMessage, Player } from '../types';

interface HomeTabProps {
  serverStats: ServerStats | null;
  chatMessages: ChatMessage[];
  onlinePlayers: Player[];
  loggedInUser: string | null;
  onSendMessage: (text: string) => Promise<void>;
  setActiveTab: (tab: string) => void;
}

export function HomeTab({ serverStats, chatMessages, onlinePlayers, loggedInUser, onSendMessage, setActiveTab }: HomeTabProps) {
  const [typedMessage, setTypedMessage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [selectedRule, setSelectedRule] = useState<number | null>(0);

  const ip = serverStats 
    ? (serverStats.serverPort === 25565 ? serverStats.serverIp : `${serverStats.serverIp}:${serverStats.serverPort}`) 
    : "72.62.119.240:29667";

  const handleCopy = () => {
    navigator.clipboard.writeText(ip);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const submitChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    await onSendMessage(typedMessage);
    setTypedMessage('');
  };

  const serverRules = [
    {
      title: "🚫 Жодних чітів та X-Ray",
      desc: "Використання будь-яких сторонніх модифікацій, чіт-клієнтів, текстур-паків X-Ray та макросів суворо заборонено. Наш античіт миттєво фіксує порушення у грі, а адміністратори переглядають логи підозрілих руд."
    },
    {
      title: "🤝 Повага та відсутність гриферства",
      desc: "Будування пасток під порталами, руйнування споруд інших гравців, крадіжка речей зі скринь без дозволу або заміна жителів у чужих поселеннях карається довічним баном. Ми підтримуємо дружню Vanilla SMP атмосферу."
    },
    {
      title: "💰 Економіка на Смарагдах (Smaragd coins)",
      desc: "Офіційна валюта сервера — смарагди. Даніелі, магазини за допомогою табличок та прямий бартер дозволять вам торгувати з іншими виживаючими. Торгова площа розміщена на спавні."
    },
    {
      title: "🗺️ Жодних запривачених територій (No Claim)",
      desc: "У нас немає класичного плагіна /claim! Гра базується на довірі та логгері CoreProtect. Будь-який блок, який вкрали чи згрифували, адміністрація може відновити за 1 клік, а грифер отримає перманентний бан. Це робить світ чистим і затишним!"
    }
  ];

  const onlineList = onlinePlayers.filter(p => p.isOnline).slice(0, 10);

  return (
    <div id="home-tab-view" className="space-y-16 py-8">
      
      {/* Bento-style Hero Header Section */}
      <section className="relative overflow-hidden bento-card bg-gradient-to-br from-indigo-950/25 via-[#121216] to-[#0a0a0c] p-8 sm:p-12 shadow-2xl relative">
        {/* Glowing deep-indigo blur nodes */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/15 blur-[120px] rounded-full" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 coords-grid opacity-15 pointer-events-none" />

        <div className="relative space-y-8 max-w-4xl px-4 py-8">
          
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Версія {serverStats?.version || "1.21.11"} — Вже у мережі!</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-tight font-sans">
            Ваша пригода<br/>
            <span className="text-indigo-400 select-none bg-indigo-500/5 px-2 rounded-xl border border-indigo-500/10 shadow-[0_0_25px_rgba(79,70,229,0.15)]">Diamant SMP</span> починається тут
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed uppercase tracking-wide font-medium">
            Diamant SMP — це крафтовий український Майнкрафт сервер, призначений для чистого виживання без грифінгу. Ми створюємо ідеальні умови для творчості, кооперації та чистої Vanilla гри.
          </p>

          <div className="flex flex-col md:flex-row items-stretch gap-4 pt-4 max-w-3xl">
            {/* Address panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-grow flex items-center justify-between">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Адреса сервера</p>
                <p className="text-lg font-mono text-indigo-400 font-black tracking-wide">{ip}</p>
              </div>
              <button
                onClick={handleCopy}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] cursor-pointer"
              >
                {copyFeedback ? "СКОПІЙОВАНО!" : "КОПІЮВАТИ"}
              </button>
            </div>

            {/* Shop Button */}
            <button
              onClick={() => setActiveTab('shop')}
              className="bg-white hover:bg-white/90 text-black font-mono text-xs font-black uppercase tracking-widest px-8 py-4 md:py-0 rounded-2xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-98"
            >
              <span>В МАГАЗИН</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Bento metrics inside Hero */}
          <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4 max-w-xl text-left">
            <div>
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-black leading-none mb-1">Гравців онлайн</p>
              <p className="text-2xl font-mono font-black text-indigo-400">
                {serverStats?.onlineCount || 14} <span className="text-xs text-gray-600 font-bold">/ {serverStats?.maxPlayers || 100}</span>
              </p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-black leading-none mb-1">Стабільність TPS</p>
              <p className="text-2xl font-mono font-black text-indigo-400">
                {serverStats?.tps || 19.9} <span className="text-sm text-indigo-400 font-black">★</span>
              </p>
            </div>
            <div>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-black leading-none mb-1">Зареєстровано</p>
              <p className="text-2xl font-mono font-black text-white">
                {serverStats?.totalRegistered || 1148}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card p-6 flex flex-col justify-between group hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-widest block mb-1">Безпека</span>
            <h3 className="font-sans text-lg font-bold text-white mb-2 leading-tight">Надійний захист споруд</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Втомилися від гриферів? На сервері підключено CoreProtect. Кожна дія відслідковується. Адміністрація може автоматично скасувати будь-які крадіжки речей або спроби псування майна.
            </p>
          </div>
        </div>

        <div className="bento-card p-6 flex flex-col justify-between group hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-widest block mb-1">Спільнота</span>
            <h3 className="font-sans text-lg font-bold text-white mb-2 leading-tight">Дружнє Ком'юніті</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Спільнота серверу влаштовує спільні великі івенти, будівництва залізниць між містами, спільний захист від рейдів та веселий дискорд-чат 24/7.
            </p>
          </div>
        </div>

        <div className="bento-card p-6 flex flex-col justify-between group hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase font-black tracking-widest block mb-1">Стабільність</span>
            <h3 className="font-sans text-lg font-bold text-white mb-2 leading-tight">Швидке залізо</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Потужний процесор Ryzen-9 та швидкісні NVMe SSD диски гарантують високий стабільний TPS без лагів та фризів навіть при великій кількості працюючих ферм червоного камню.
            </p>
          </div>
        </div>
      </section>

      {/* Live Server Interactive Chat Terminal and Interactive World Map */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Live Chat Component */}
        <div className="lg:col-span-7 bg-[#0f0f13] border border-white/10 rounded-3xl flex flex-col h-[480px] overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-[#050507] px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="pl-1.5 font-mono text-[9px] font-black text-gray-500 uppercase tracking-widest">ЧАТ СЕРВЕРА В РЕАЛЬНОМУ ЧАСІ</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="font-mono text-[9px] text-indigo-400 uppercase tracking-widest font-black">Синхронізовано</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
            {chatMessages.map((msg, index) => {
              const isAnnouncement = msg.sender.includes("[МАГАЗИН]");
              return (
                <div key={msg.id} className="flex hover:bg-white/5 p-1 px-2 rounded-lg transition-colors items-start space-x-2">
                  <span className="text-gray-600 select-none text-[10px]">[{msg.time}]</span>
                  
                  {isAnnouncement ? (
                    <div className="flex-1 text-indigo-400 font-bold bg-indigo-500/10 p-1 px-2 rounded-lg border border-indigo-500/20">
                      {msg.sender} {msg.text}
                    </div>
                  ) : (
                    <p className="text-gray-300">
                      <span className={`font-bold mr-1.5 ${
                        msg.rank === 'king' ? 'text-amber-400' :
                        msg.rank === 'lord' ? 'text-indigo-400' :
                        msg.rank === 'knight' ? 'text-purple-400' :
                        msg.rank === 'wanderer' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                        &lt;{msg.sender}&gt;
                      </span>
                      {msg.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* User Input Form */}
          <form onSubmit={submitChat} className="bg-[#050507] border-t border-white/10 p-3 flex gap-2">
            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder={loggedInUser ? "Напишіть повідомлення в Майнкрафт чат..." : "Щоб писати в ігровий чат, увійдіть у кабінет"}
              disabled={!loggedInUser}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl outline-none px-4 py-2.5 font-mono text-xs text-white placeholder-gray-500 focus:border-indigo-500 disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={!loggedInUser || !typedMessage.trim()}
              className="bg-indigo-600 text-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Надіслати</span>
            </button>
          </form>
        </div>

        {/* Dynamic World Map Simulator */}
        <div className="lg:col-span-5 bg-[#0f0f13] border border-white/10 rounded-3xl flex flex-col h-[480px] overflow-hidden">
          <div className="bg-[#050507] px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-widest">КАРТА СВІТУ (DYNMAP / BLUE_MAP)</span>
            <span className="font-mono text-[8px] text-indigo-400 bg-indigo-500/10 border border-indigo-400/20 px-1.5 py-0.5 rounded font-black">R: 2000м</span>
          </div>

          {/* Pseudo Live Map Render */}
          <div className="flex-1 relative bg-[#1c2c1e] coords-grid flex items-center justify-center p-8 select-none">
            
            {/* Compass HUD */}
            <div className="absolute top-3 left-3 bg-[#0a0a0c]/90 border border-white/10 px-2.5 py-1.5 rounded-xl font-mono text-[9px] text-gray-400 space-y-0.5 pointer-events-none">
              <p>📍 X: 342, Z: -188</p>
              <p>🧭 Напрямок: Північ</p>
              <p>🗺️ Світ: Overworld</p>
            </div>

            {/* Spawn Point Marker */}
            <div className="absolute transition-transform hover:scale-125 cursor-pointer flex flex-col items-center group">
              <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500 rounded-full flex items-center justify-center text-indigo-300 animate-pulse text-[11px] font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                🏰
              </div>
              <span className="bg-[#0a0a0c]/90 text-indigo-400 font-mono text-[8px] px-1.5 py-0.5 rounded-lg mt-1 border border-indigo-500/20 whitespace-nowrap opacity-75 group-hover:opacity-100">
                Спавн & Ринок 
              </span>
            </div>

            {/* Custom active player markings (dynamic mock markers) */}
            <div className="absolute top-[30%] left-[20%] flex flex-col items-center cursor-pointer group hover:opacity-100 opacity-80 transition-opacity">
              <div className="w-4 h-4 rounded-full bg-indigo-500 border border-white flex items-center justify-center text-[8px] text-white overflow-hidden animate-bounce">
                🧙
              </div>
              <span className="bg-[#0a0a0c]/90 text-white font-mono text-[8px] px-1 rounded mt-0.5">
                SmaragdOwner (240h)
              </span>
            </div>

            <div className="absolute bottom-[25%] right-[20%] flex flex-col items-center cursor-pointer group hover:opacity-100 opacity-80">
              <div className="w-4 h-4 rounded-full bg-purple-500 border border-white flex items-center justify-center text-[8px] text-white overflow-hidden">
                ⚔️
              </div>
              <span className="bg-[#0a0a0c]/90 text-white font-mono text-[8px] px-1 rounded mt-0.5">
                Bandera_Min..
              </span>
            </div>

            <div className="absolute top-[40%] right-[35%] flex flex-col items-center cursor-pointer group hover:opacity-100 opacity-80">
              <div className="w-4 h-4 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[8px] text-white overflow-hidden">
                👑
              </div>
              <span className="bg-[#0a0a0c]/90 text-white font-mono text-[8px] px-1 rounded mt-0.5">
                YaroslavSky
              </span>
            </div>

            {/* Grid Coordinates Label Layer */}
            <div className="absolute bottom-3 right-3 bg-[#0a0a0c]/90 border border-white/10 px-2 py-1 rounded font-mono text-[8px] text-gray-500 pointer-events-none">
              Diamant SMP Map v1.2
            </div>
            
            <p className="text-indigo-400/40 font-mono text-center max-w-[200px] text-[10px] font-black leading-relaxed uppercase pointer-events-none select-none tracking-widest border border-indigo-500/10 p-3 rounded-xl bg-indigo-500/5">
              АКТИВНА КАРТА СЕВЕРУ
            </p>
          </div>

          {/* Active players lists footer */}
          <div className="bg-[#050507] p-3 border-t border-white/10">
            <p className="font-mono text-[9px] text-gray-500 mb-1.5 uppercase font-black tracking-widest">
              Гравці у грі в цю мить ({onlineList.length}):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {onlineList.map(player => (
                <span key={player.id} className="inline-flex items-center space-x-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-[10px] font-mono hover:text-indigo-400 cursor-pointer transition-colors text-white">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                  <span>{player.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Interactive Rules Section */}
      <section className="bg-[#0f0f13] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <h2 className="font-sans text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center space-x-2.5">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>Звід Законів та Правил Diamant SMP</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serverRules.map((rule, index) => {
            const isSelected = selectedRule === index;
            return (
              <div
                key={index}
                onClick={() => setSelectedRule(isSelected ? null : index)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600/10 border-indigo-500/30"
                    : "bg-white/5 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white transition-colors">
                    {rule.title}
                  </h3>
                  <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${isSelected ? "text-indigo-400" : "text-gray-500"}`}>
                    {isSelected ? "ЗГОРНУТИ" : "ЧИТАТИ"}
                  </span>
                </div>
                {isSelected && (
                  <p className="mt-3 text-xs text-gray-300 font-sans leading-relaxed transition-all">
                    {rule.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-center">
          <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-black">
            ⚖️ Граючи на нашому сервері Diamant SMP, ви автоматично погоджуєтеся дотримуватися вищезазначених умов. Незнання правил не звільняє від відповідальності!
          </p>
        </div>
      </section>

    </div>
  );
}
