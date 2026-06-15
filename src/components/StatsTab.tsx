import React, { useState } from 'react';
import { BarChart3, Users, Zap, Search, Clock, Skull, Swords, Pickaxe, Shield, Award, Sparkles, Server } from 'lucide-react';
import { ServerStats, Player } from '../types';

interface StatsTabProps {
  serverStats: ServerStats | null;
  players: Player[];
}

export function StatsTab({ serverStats, players }: StatsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPlayer, setSearchedPlayer] = useState<Player | null>(null);
  const [searchError, setSearchError] = useState('');

  // Sorters for leaderboards
  const topPlaytime = [...players].sort((a,b) => b.playtime - a.playtime).slice(0, 5);
  const topMobKills = [...players].sort((a,b) => b.mobKills - a.mobKills).slice(0, 5);
  const topMined = [...players].sort((a,b) => b.minedSmaragds - a.minedSmaragds).slice(0, 5);
  const topDeaths = [...players].sort((a,b) => b.deaths - a.deaths).slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = players.find(p => p.name.toLowerCase() === query);

    if (found) {
      setSearchedPlayer(found);
      setSearchError('');
    } else {
      setSearchedPlayer(null);
      setSearchError('Гравця з таким нікнеймом не знайдено на сервері. Можливо, він не зареєстрований або ще не заходив.');
    }
  };

  const getRankBadge = (rank: string) => {
    switch (rank) {
      case 'king': return { name: 'Смарагдовий Король', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'lord': return { name: 'Володар', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'knight': return { name: 'Лицар', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      case 'wanderer': return { name: 'Мандрівник', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      default: return { name: 'Гравець', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' };
    }
  };

  // Convert playtime decimal to hours/mins
  const formatPlaytime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}г. ${m}хв.`;
  };

  return (
    <div id="stats-tab-view" className="space-y-12 py-8">
      
      {/* Search Bar / Panel */}
      <section className="bg-mine-card border border-mine-border rounded-xl p-6 sm:p-8">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="font-mono text-lg font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Перевірка статистики будь-якого гравця</span>
          </h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Введіть точний Minecraft нікнейм, щоб переглянути його ігрові бали, баланс, час виживання та привілеї.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введіть нікнейм (наприклад: DiamantOwner)..."
              className="flex-1 bg-mine-dark border border-mine-border rounded-lg outline-none px-4 py-3 font-mono text-xs text-white placeholder-gray-500 focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-mine-darker px-5 rounded-lg font-mono text-xs font-bold transition-colors flex items-center space-x-1"
            >
              <Search className="w-4 h-4" />
              <span>Шукати</span>
            </button>
          </form>

          {searchError && (
            <p className="text-xs font-mono text-red-400 bg-red-500/5 p-2 rounded border border-red-500/10">
              {searchError}
            </p>
          )}
        </div>

        {/* Selected Searched Player Card */}
        {searchedPlayer && (
          <div className="mt-8 bg-mine-dark rounded-xl border border-mine-border p-5 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-6 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1.5 bg-emerald-500/10 border-l border-b border-emerald-500/20 text-emerald-400 font-mono text-[9px]">
              ПРОФІЛЬ ЗНАЙДЕНО
            </div>

            {/* Simulated Head Avatar */}
            <div className="w-24 h-24 bg-[#111] rounded-xl border-2 border-mine-border flex items-center justify-center p-2 relative overflow-hidden select-none">
              {/* Fallback canvas pixel character representing classic Minecraft square face */}
              <div className="w-16 h-16 bg-emerald-750 border border-emerald-500/30 rounded flex flex-col justify-between p-1.5. bg-[#5a3d28]">
                {/* Hair and Eyes pixels */}
                <div className="flex justify-between w-full">
                  <span className="w-2 h-2 bg-[#1b1c1d]" />
                  <span className="w-2 h-2 bg-[#1b1c1d]" />
                </div>
                <div className="flex justify-between w-full my-1">
                  <span className="w-3 h-2 bg-blue-400" />
                  <span className="w-3 h-2 bg-blue-400" />
                </div>
                <div className="w-full h-2 bg-[#d2a37d]" />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 text-center sm:text-left space-y-4 w-full">
              <div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <span className="font-mono text-lg font-bold text-white">{searchedPlayer.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider font-semibold ${getRankBadge(searchedPlayer.rank).color}`}>
                    {getRankBadge(searchedPlayer.rank).name}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-gray-400 mt-1">Реєстрація: {new Date(searchedPlayer.registeredAt).toLocaleDateString('uk-UA')}</p>
              </div>

              {/* Stat parameters itemized grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-mine-card/85 p-2 px-3 rounded-lg border border-mine-border text-center">
                  <p className="text-[8px] font-mono text-gray-500 leading-none uppercase mb-1">Гроші коїни</p>
                  <p className="text-emerald-400 font-mono text-xs font-extrabold">{searchedPlayer.balance} 🟢</p>
                </div>
                <div className="bg-mine-card/85 p-2 px-3 rounded-lg border border-mine-border text-center">
                  <p className="text-[8px] font-mono text-gray-500 leading-none uppercase mb-1">Виживання</p>
                  <p className="text-white font-mono text-xs font-bold">{formatPlaytime(searchedPlayer.playtime)}</p>
                </div>
                <div className="bg-mine-card/85 p-2 px-3 rounded-lg border border-mine-border text-center">
                  <p className="text-[8px] font-mono text-gray-500 leading-none uppercase mb-1">Мобів вбито</p>
                  <p className="text-purple-400 font-mono text-xs font-bold">{searchedPlayer.mobKills} ⚔️</p>
                </div>
                <div className="bg-mine-card/85 p-2 px-3 rounded-lg border border-mine-border text-center">
                  <p className="text-[8px] font-mono text-gray-500 leading-none uppercase mb-1">Добуто руди</p>
                  <p className="text-amber-400 font-mono text-xs font-semibold">{searchedPlayer.minedSmaragds} 💎</p>
                </div>
              </div>

              <div className="text-xs text-gray-400 font-sans flex items-center justify-center sm:justify-start gap-1">
                <span className={`w-2 h-2 rounded-full ${searchedPlayer.isOnline ? 'bg-emerald-400' : 'bg-red-500'} animate-pulse`} />
                <span>{searchedPlayer.isOnline ? 'Грає в гру на сервері прямо зараз!' : `Востаннє бачили: ${searchedPlayer.lastSeen}`}</span>
              </div>
            </div>

          </div>
        )}
      </section>

      {/* Gauges section (Live Performance and status bars) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Live System performance */}
        <div className="bg-mine-card border border-mine-border rounded-xl p-5">
          <div className="border-b border-mine-border pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Двостороння продуктивність заліза</span>
            </h3>
            <span className="font-mono text-[10px] text-gray-500 bg-mine-dark p-1 rounded">256MB Buffers</span>
          </div>

          <div className="space-y-4">
            {/* TPS Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Швидкість тактів сервера (TPS):</span>
                <span className="text-emerald-400 font-bold">{serverStats?.tps || 19.95} TPS</span>
              </div>
              <div className="w-full bg-mine-dark h-2.5 rounded-full overflow-hidden border border-mine-border">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${((serverStats?.tps || 19.95) / 20) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-500 font-mono leading-none">Нормальне значення: 20.0 TPS. Нижче 15 TPS викликає затримку рухів.</p>
            </div>

            {/* CPU utilization */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Навантаження CPU (Ryzen 9):</span>
                <span className="text-white font-bold">{serverStats?.cpu || 18.4}%</span>
              </div>
              <div className="w-full bg-mine-dark h-2.5 rounded-full overflow-hidden border border-mine-border">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${serverStats?.cpu || 18.4}%` }}
                />
              </div>
            </div>

            {/* RAM utilization */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Виділена оперативна пам'ять RAM:</span>
                <span className="text-white font-bold">{serverStats?.ramUsage || 4.82} GB / {serverStats?.ramMax || 16} GB</span>
              </div>
              <div className="w-full bg-mine-dark h-2.5 rounded-full overflow-hidden border border-mine-border">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${((serverStats?.ramUsage || 4.82) / (serverStats?.ramMax || 16)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Static Map visual stats diagram */}
        <div className="bg-mine-card border border-mine-border rounded-xl p-5 flex flex-col justify-between">
          <div className="border-b border-mine-border pb-3 mb-4">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Динаміка мережі за 24 години
            </h3>
          </div>

          {/* Simple animated high contrast custom SVG Line chart */}
          <div className="flex-1 min-h-[140px] flex items-end justify-between gap-1 border-b border-l border-mine-border pb-2 block relative">
            
            {/* Simulated Grid overlay lines */}
            <div className="absolute inset-x-0 top-1/4 border-t border-mine-border/30 border-dashed" />
            <div className="absolute inset-x-0 top-2/4 border-t border-mine-border/30 border-dashed" />
            <div className="absolute inset-x-0 top-3/4 border-t border-mine-border/30 border-dashed" />

            <div className="absolute top-2 left-2 text-[8px] font-mono text-gray-500 uppercase">Макс Гравців: 65 онлайн</div>

            {/* Render bars representing hours online */}
            <div className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/35 h-[20%] text-center rounded-t border-t border-emerald-500 transition-all cursor-pointer group relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white p-0.5 rounded text-[8px] opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">04:00 (12)</span>
            </div>
            <div className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/35 h-[15%] text-center rounded-t border-t border-emerald-500 transition-all cursor-pointer group relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white p-0.5 rounded text-[8px] opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">08:00 (8)</span>
            </div>
            <div className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/35 h-[35%] text-center rounded-t border-t border-emerald-500 transition-all cursor-pointer group relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white p-0.5 rounded text-[8px] opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">12:00 (22)</span>
            </div>
            <div className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/35 h-[55%] text-center rounded-t border-t border-emerald-500 transition-all cursor-pointer group relative font-bold">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white p-0.5 rounded text-[8px] opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 text-emerald-300">ПІК 16:00 (42 онлайн)</span>
            </div>
            <div className="flex-1 bg-emerald-500/25 hover:bg-emerald-500/40 h-[75%] text-center rounded-t border-t-2 border-emerald-400 transition-all cursor-pointer group relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white p-0.5 rounded text-[8px] opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">20:00 (52)</span>
            </div>
            <div className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/35 h-[40%] text-center rounded-t border-t border-emerald-500 transition-all cursor-pointer group relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white p-0.5 rounded text-[8px] opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">24:00 (28)</span>
            </div>
          </div>

          <div className="flex justify-between font-mono text-[8px] text-gray-500 pt-1">
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>24:00</span>
          </div>
        </div>

      </section>

      {/* Leaderboards Quad layout */}
      <section className="space-y-6">
        <h2 className="font-mono text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-mine-border pb-3">
          <Award className="w-5 h-5 text-emerald-400" />
          <span>Загальний зал слави Diamant SMP (Топ гравці)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Playtime leaderboard */}
          <div className="bg-mine-card/60 border border-mine-border rounded-xl p-4 space-y-3.5">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-mine-border/50 pb-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Час у грі (Години)</span>
            </h3>
            
            <ol className="space-y-2 font-mono text-xs">
              {topPlaytime.map((player, idx) => (
                <li key={player.id} className="flex justify-between items-center bg-mine-dark/40 p-1.5 px-2.5 rounded border border-mine-border/30">
                  <span className="text-gray-400 font-semibold">{idx+1}. {player.name}</span>
                  <span className="text-emerald-400 font-bold">{formatPlaytime(player.playtime)}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Mob Kills Leaderboard */}
          <div className="bg-mine-card/60 border border-mine-border rounded-xl p-4 space-y-3.5">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-mine-border/50 pb-2">
              <Swords className="w-4 h-4 text-purple-400" />
              <span>Вбиті Моби</span>
            </h3>

            <ol className="space-y-2 font-mono text-xs">
              {topMobKills.map((player, idx) => (
                <li key={player.id} className="flex justify-between items-center bg-mine-dark/40 p-1.5 px-2.5 rounded border border-mine-border/30">
                  <span className="text-gray-400 font-semibold">{idx+1}. {player.name}</span>
                  <span className="text-purple-400 font-bold">{player.mobKills} 💀</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Mining blocks leaderboard */}
          <div className="bg-mine-card/60 border border-mine-border rounded-xl p-4 space-y-3.5">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-mine-border/50 pb-2">
              <Pickaxe className="w-4 h-4 text-amber-500" />
              <span>Добуто Смарагдів</span>
            </h3>

            <ol className="space-y-2 font-mono text-xs">
              {topMined.map((player, idx) => (
                <li key={player.id} className="flex justify-between items-center bg-mine-dark/40 p-1.5 px-2.5 rounded border border-mine-border/30">
                  <span className="text-gray-400 font-semibold">{idx+1}. {player.name}</span>
                  <span className="text-amber-400 font-bold">{player.minedSmaragds} 🟢</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Deaths Leaderboard */}
          <div className="bg-mine-card/60 border border-mine-border rounded-xl p-4 space-y-3.5">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-mine-border/50 pb-2">
              <Skull className="w-4 h-4 text-red-400" />
              <span>Кількість Смертей</span>
            </h3>

            <ol className="space-y-2 font-mono text-xs">
              {topDeaths.map((player, idx) => (
                <li key={player.id} className="flex justify-between items-center bg-mine-dark/40 p-1.5 px-2.5 rounded border border-mine-border/30">
                  <span className="text-gray-400 font-semibold">{idx+1}. {player.name}</span>
                  <span className="text-red-400 font-bold">{player.deaths} р.</span>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </section>

    </div>
  );
}
