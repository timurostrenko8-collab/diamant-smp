import React, { useState } from 'react';
import { User, Coins, Key, LogOut, Check, ArrowRight, RefreshCw, Box, AlertTriangle, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { Player, RankType } from '../types';

interface CabinetTabProps {
  loggedInUser: string | null;
  onLogin: (nickname: string) => Promise<void>;
  onLogout: () => void;
  playerProfile: Player | null;
  onExchangeSmaragds: (amount: number) => Promise<void>;
  onSendChatMessage: (text: string) => Promise<void>;
}

export function CabinetTab({
  loggedInUser,
  onLogin,
  onLogout,
  playerProfile,
  onExchangeSmaragds,
  onSendChatMessage
}: CabinetTabProps) {
  const [nicknameInput, setNicknameInput] = useState('');
  const [exchangeAmount, setExchangeAmount] = useState('10');
  const [exchangeSuccess, setExchangeSuccess] = useState('');
  const [exchangeError, setExchangeError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<Record<string, boolean>>({});

  const [testChatText, setTestChatText] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    setIsLoading(true);
    setLoginError('');
    try {
      await onLogin(nicknameInput.trim());
    } catch (err: any) {
      setLoginError(err.message || 'Помилка авторизації.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExchangeError('');
    setExchangeSuccess('');
    const amt = parseInt(exchangeAmount);
    
    if (isNaN(amt) || amt <= 0) {
      setExchangeError('Вкажіть коректну кількість смарагдів!');
      return;
    }

    if (!playerProfile || playerProfile.donorBalance < amt) {
      setExchangeError('Недостатньо преміум смарагдів на балансі кабінету!');
      return;
    }

    try {
      await onExchangeSmaragds(amt);
      setExchangeSuccess(`Успішно обміняно ${amt} преміум смарагдів на ${amt * 100} ігрових коїнів! Смарангди нараховано.`);
    } catch (err) {
      setExchangeError('Не вдалося виконати обмін.');
    }
  };

  const handleClaimItem = (itemId: string, itemName: string) => {
    setClaimStatus(prev => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      // Simulate claims completion
    }, 2000);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testChatText.trim()) return;
    await onSendChatMessage(testChatText);
    setTestChatText('');
  };

  const getRankNameText = (rank: RankType) => {
    switch (rank) {
      case 'king': return { name: 'Смарагдовий Король', color: 'text-amber-400 font-extrabold' };
      case 'lord': return { name: 'Володар', color: 'text-emerald-400 font-bold' };
      case 'knight': return { name: 'Лицар', color: 'text-purple-400 font-bold' };
      case 'wanderer': return { name: 'Мандрівник', color: 'text-blue-400 font-semibold' };
      default: return { name: 'Звичайний Гравець', color: 'text-gray-400' };
    }
  };

  // Login component rendering
  if (!loggedInUser || !playerProfile) {
    return (
      <div id="cabinet-login-view" className="max-w-md mx-auto py-12">
        <div className="bg-mine-card border border-mine-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h2 className="font-mono text-xl font-bold text-white tracking-tight">Вхід в Особистий Кабінет</h2>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Введіть ваш ігровий Minecraft нікнейм, під яким ви граєте на сервері, щоб увійти або автоматично створити аккаунт.
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs font-mono text-red-400 text-center">
              ⚠ Помилка: {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ваш Minecraft Нікнейм:</label>
              <input
                type="text"
                pattern="^[a-zA-Z0-9_]{3,16}$"
                title="Від 3 до 16 латинських символів та підкреслення"
                required
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Наприклад: YaroslavSky"
                className="w-full bg-mine-dark border border-mine-border rounded-lg outline-none px-4 py-3 font-mono text-xs text-white focus:border-emerald-500 placeholder-gray-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-mine-darker font-mono text-xs font-bold py-3.5 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/10"
            >
              {isLoading ? (
                <span>Входимо...</span>
              ) : (
                <>
                  <span>Увійти / Зареєструватись</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[10px] text-gray-500 font-mono text-center leading-normal">
            ⚙️ Пароль не потрібен! Ми використовуємо систему швидкої верифікації по нікнейму. Баланси та куплені речі прив'язуються виключно до вашого нікнейму в базі.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated Profile Cabinet rendering
  return (
    <div id="cabinet-authenticated-view" className="space-y-10 py-8">
      
      {/* Profile Overview Banner card */}
      <section className="bg-mine-card border border-mine-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 bg-emerald-500/15 border-l border-b border-emerald-500/30 text-emerald-400 font-mono text-[9px] uppercase font-bold tracking-wider rounded-bl">
          Особистий Кабінет Активний
        </div>

        {/* Character Skin preview (Mojang avatar reference and mock) */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
          <div className="w-20 h-20 bg-mine-dark rounded-xl border border-mine-border flex items-center justify-center select-none shrink-0 relative p-1 leading-none shadow-sm shadow-emerald-500/5">
            {/* Displaying real-time avatar with user name or retro block logo */}
            <div className="w-14 h-14 bg-emerald-800 rounded flex flex-col justify-between p-1-[#2a3c2e] bg-[#212429] border border-emerald-500/30">
              <div className="flex justify-between w-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded" />
              </div>
              <div className="mx-auto text-xl">🧑‍🚀</div>
              <div className="w-full h-1 bg-emerald-500" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="font-mono text-2xl font-bold text-white leading-tight flex items-center justify-center sm:justify-start gap-2">
              <span>{playerProfile.name}</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] border uppercase ${getRankNameText(playerProfile.rank).color} bg-white/5 border-white/10`}>
                Ранг: {getRankNameText(playerProfile.rank).name}
              </span>
              <span className="text-gray-400 font-mono">| Реєстрація: {new Date(playerProfile.registeredAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Balance displays */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto border-t md:border-t-0 border-mine-border/50 pt-4 md:pt-0">
          
          {/* Premiums Smaragds */}
          <div className="bg-mine-dark border border-mine-border p-3 px-5 rounded-xl text-center min-w-[130px] shadow-sm">
            <p className="text-[9px] font-mono text-gray-500 uppercase leading-none mb-1">Баланс Кабінету (Донат)</p>
            <div className="flex items-center justify-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-base font-black text-white">{playerProfile.donorBalance}</span>
              <span className="text-[10px] text-emerald-400 font-bold">смар.</span>
            </div>
          </div>

          {/* In-game coins standard */}
          <div className="bg-mine-dark border border-mine-border p-3 px-5 rounded-xl text-center min-w-[130px] shadow-sm">
            <p className="text-[9px] font-mono text-gray-500 uppercase leading-none mb-1">Баланс у грі (Коїни)</p>
            <div className="flex items-center justify-center space-x-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-mono text-base font-extrabold text-white">{playerProfile.balance}</span>
              <span className="text-[10px] text-amber-500">коїнів</span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={onLogout}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all hover:text-red-300 active:scale-95 shrink-0"
            title="Вийти з кабінету"
          >
            <LogOut className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </section>

      {/* Main functions tabs: Smaragds converter & Delivery Chest */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Smaragd premium converter to Game currency */}
        <div className="lg:col-span-5 bg-mine-card border border-mine-border rounded-xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-mine-border pb-3">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Обмінник донат-смарагдів у гру</span>
            </h3>
            <p className="text-[11px] text-gray-400 font-sans mt-0.5 leading-normal">
              Ви можете обміняти накопичені преміум смарагди на ігрові коїни. Курс фіксований: <span className="text-emerald-400 font-bold font-mono">1 Смарагд = 100 ігрових коїнів</span>.
            </p>
          </div>

          {exchangeSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs font-mono text-emerald-300 text-center">
              🟢 {exchangeSuccess}
            </div>
          )}

          {exchangeError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs font-mono text-red-400 text-center">
              ⚠ Помилка: {exchangeError}
            </div>
          )}

          <form onSubmit={handleExchangeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] text-gray-400 uppercase">Оберіть кількість смарагдів для обміну:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max={playerProfile.donorBalance}
                  value={exchangeAmount}
                  onChange={(e) => setExchangeAmount(e.target.value)}
                  className="flex-1 bg-mine-dark border border-mine-border rounded-lg outline-none px-4 py-2.5 font-mono text-sm text-white focus:border-emerald-500 transition-colors"
                />
                
                {/* Max button shortcut */}
                <button
                  type="button"
                  onClick={() => setExchangeAmount(playerProfile.donorBalance.toString())}
                  className="bg-mine-border hover:bg-mine-border/80 border border-mine-border rounded-lg px-4 text-xs font-mono font-bold text-white active:scale-95"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Calculations review */}
            <div className="bg-mine-dark p-3 rounded-lg border border-mine-border/80 font-mono text-xs space-y-1 text-gray-400">
              <div className="flex justify-between">
                <span>Буде списано:</span>
                <span className="text-white font-bold">{exchangeAmount || 0} смар.</span>
              </div>
              <div className="flex justify-between">
                <span>Буде нараховано у грі:</span>
                <span className="text-emerald-400 font-extrabold">+{(parseInt(exchangeAmount) || 0) * 100} коїнів</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={playerProfile.donorBalance <= 0 || parseInt(exchangeAmount) <= 0 || isNaN(parseInt(exchangeAmount))}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 disabled:bg-gray-700 disabled:text-gray-400 text-mine-darker font-mono text-xs font-bold py-3.5 rounded-lg transition-transform hover:scale-101 outline-none"
            >
              Підтвердити обмін коштів
            </button>
          </form>
        </div>

        {/* Claim Delivery Chest from web orders */}
        <div className="lg:col-span-7 bg-mine-card border border-mine-border rounded-xl p-5 sm:p-6 space-y-5">
          <div className="border-b border-mine-border pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Box className="w-4 h-4 text-amber-500" />
                <span>Речі та бонуси для завантаження (/claim)</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5 leading-normal">
                Придбані предмети з магазину чекають на вашу команду. Натисніть "Отримати", щоб скопіювати команду активації.
              </p>
            </div>
            
            <span className="font-mono text-[9px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">2 Ключі чекають</span>
          </div>

          <div className="space-y-3.5">
            {/* Items ready for redeem */}
            <div className="flex items-center justify-between p-3.5 bg-mine-dark/80 rounded-xl border border-mine-border hover:border-amber-500/20 transition-all">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🔑</span>
                <div>
                  <h4 className="font-mono text-xs font-bold text-white">Уламок Зірки Незера (Legendary Key)</h4>
                  <p className="text-[10px] text-gray-500 font-mono">Активація легендарного кейсу на спавні</p>
                </div>
              </div>
              
              {claimStatus['legendary_key'] ? (
                <div className="text-right">
                  <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md mb-1 block">Скопійовано!</span>
                  <p className="text-[8px] font-mono text-gray-500">Введіть у консоль гри</p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('/claim key star_fragment 1');
                    handleClaimItem('legendary_key', 'Ключ спавну');
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-mine-darker px-3 py-1.5 font-mono text-[11px] font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
                >
                  Отримати код
                </button>
              )}
            </div>

            <div className="flex items-center justify-between p-3.5 bg-mine-dark/80 rounded-xl border border-mine-border hover:border-amber-500/20 transition-all">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🍔</span>
                <div>
                  <h4 className="font-mono text-xs font-bold text-white">Стартовий Сет Їжі (Donation Starter Pack)</h4>
                  <p className="text-[10px] text-gray-500 font-mono">16 смажених стейків та золота мотика</p>
                </div>
              </div>

              {claimStatus['starter_pack'] ? (
                <div className="text-right">
                  <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md mb-1 block">Скопійовано!</span>
                  <p className="text-[8px] font-mono text-gray-500">Команда скопійована</p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('/claim items pack_starter');
                    handleClaimItem('starter_pack', 'Донат їжа');
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-mine-darker px-3 py-1.5 font-mono text-[11px] font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
                >
                  Отримати код
                </button>
              )}
            </div>
            
            {/* Warning block */}
            <div className="p-3 bg-mine-dark rounded-xl border border-mine-border text-[11px] font-sans text-gray-400 leading-normal">
              💡 <span className="text-amber-400 font-bold font-mono">Як отримати речі у майнкрафті:</span> Копіюйте команду по кнопці вище, заходьте на сервер Diamant SMP та вставляйте її в консоль натисканням клавіш <kbd className="bg-mine-border px-1 py-0.5 rounded text-[10px] text-white">T</kbd> + <kbd className="bg-mine-border px-1 py-0.5 rounded text-[10px] text-white">Ctrl + V</kbd>. Отриманий бонус з'явиться у вашому рюкзаку!
            </div>
          </div>
        </div>

      </section>

      {/* Web console message simulation */}
      <section className="bg-mine-card border border-mine-border rounded-xl p-5 sm:p-6 space-y-4">
        <div className="border-b border-mine-border pb-2.5">
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Швидка репліка в ігровий чат</span>
          </h3>
          <p className="text-[11px] text-gray-400 font-sans mt-0.5 leading-normal">
            Хочете щось сказати гравцям прямо зараз? Напишіть це з веб-кабінету! Ваше повідомлення з'явиться у грі перед усіма онлайн користувачами сервера з префіксом <span className="text-emerald-400 font-semibold">[Web]</span>.
          </p>
        </div>

        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Привіт усім! Я зареєструвався через сайт. Слава Україні! 🇺🇦"
            value={testChatText}
            maxLength={100}
            onChange={(e) => setTestChatText(e.target.value)}
            className="flex-1 bg-mine-dark border border-mine-border rounded-lg outline-none px-4 py-2.5 font-mono text-xs text-white focus:border-emerald-500 placeholder-gray-600 transition-colors"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-mine-darker px-5 font-mono text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center space-x-1"
          >
            <MessageSquare className="w-3.5 h-3.5 animate-pulse" />
            <span>Надіслати</span>
          </button>
        </form>
      </section>

    </div>
  );
}
