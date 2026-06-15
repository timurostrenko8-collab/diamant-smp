import React, { useState } from 'react';
import { ShoppingBag, Check, ShieldCheck, HelpCircle, ArrowRight, User, CreditCard, Apple, Sparkles, Loader2, Award, Zap, Coins, Key } from 'lucide-react';
import { ShopItem, Player } from '../types';

interface ShopTabProps {
  loggedInUser: string | null;
  onPurchaseComplete: (purchaseDetails: {
    nickname: string;
    itemId: string;
    itemName: string;
    itemCategory: 'ranks' | 'items';
    price: number;
    paymentMethod: string;
  }) => Promise<void>;
  players: Player[];
}

export function ShopTab({ loggedInUser, onPurchaseComplete, players }: ShopTabProps) {
  const [nickname, setNickname] = useState(loggedInUser || '');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ranks' | 'items'>('all');
  
  // Payment Modal State
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [paymentStep, setPaymentStep] = useState<'nickname' | 'method' | 'card' | 'processing' | 'success'>('nickname');
  
  // Form fields state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'monobank' | 'applepay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [formError, setFormError] = useState('');

  const shopItems: ShopItem[] = [
    {
      id: "wanderer",
      name: "Ранг Мандрівник (Wanderer)",
      description: "Перший рівень підтримки. Дарує гарний синій префікс, стартовий набір речей, 3 точки дому та збільшене сховище.",
      price: 49,
      category: "ranks",
      icon: "wanderer",
      features: [
        "Префікс [Мандрівник]",
        "Стартовий набір: /kit wanderer (раз на тиждень)",
        "3 слоти для збереження точок дому (/sethome)",
        "Можливість писати з кольоровими кодами у локальний чат"
      ]
    },
    {
      id: "knight",
      name: "Ранг Лицар (Knight)",
      description: "Середній рівень для досвідчених воїнів. Дає доступ до пріоритетної черги, унікальних префіксів та смарагдового бонусу.",
      price: 149,
      category: "ranks",
      icon: "knight",
      features: [
        "Префікс [Лицар]",
        "Набір заліза та смарагдів: /kit knight (раз на 5 днів)",
        "5 слотів для точок дому",
        "Доступ на сервер поза чергою при переповненому лобі",
        "Анімація світіння при купанні у воді",
        "Транспортний засіб: Швидкий Кінь на команду"
      ]
    },
    {
      id: "lord",
      name: "Ранг Володар (Lord)",
      description: "Преміум ранг для справжніх елітарних будівельників та лідерів. Можливість літати, створювати портали та вішати рюкзак.",
      price: 299,
      category: "ranks",
      icon: "lord",
      features: [
        "Префікс [Володар]",
        "Набір алмазів: /kit lord (кожні 3 дні)",
        "8 точок дому",
        "Портативний віртуальний верстак (/craft)",
        "Команда повернутися на місце смерті (/back)",
        "Запуск особистого салюту (/fw)"
      ]
    },
    {
      id: "king",
      name: "Діамантовий Король (Diamant King)",
      description: "Максимальна підтримка сервера. Дарує право вільного польоту (/fly), унікальні анімаційні ефекти, окремого супутника-компаньйона та кастомні емодзі.",
      price: 599,
      category: "ranks",
      icon: "king",
      features: [
        "Префікс [Діамантовий Король]",
        "Найвеличніший набір: /kit king (кожні 2 дні)",
        "Необмежена кількість точок дому",
        "Політ на всьому сервері (/fly)",
        "Команда відновити здоров'я раз на годину (/heal)",
        "Створення власного магазину без податку на спавні",
        "Кастомний улюбленець (папуга, вовк чи кіт) супроводжує у грі"
      ]
    },
    {
      id: "items_500",
      name: "Скриня Смарагдів (500 шт.)",
      description: "Милий скриньовий набір чистих блискучих смарагдів. Можна активувати у особистому кабінеті й вивести на свій рахунок у гру.",
      price: 50,
      category: "items",
      icon: "emerald_stack"
    },
    {
      id: "items_1200",
      name: "Скарбниця Смарагдів (1200 шт.)",
      description: "Велика залізна скарбниця заповнена доверху смарагдами для впевнених торгівців на спавн-ринку.",
      price: 100,
      category: "items",
      icon: "emerald_vault"
    },
    {
      id: "legendary_key",
      name: "Уламок Зірки Незера (Legendary Key)",
      description: "Стародавній небесний ключ від легендарної скрині скарбів на спавні. Дає гарантовані унікальні інструменти, бронекомплекти або елітри.",
      price: 35,
      category: "items",
      icon: "key"
    }
  ];

  const filteredItems = shopItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const openPayment = (item: ShopItem) => {
    setSelectedItem(item);
    setNickname(loggedInUser || '');
    // If nickname is set and belongs to an existing logged-in user, skip nick verification step
    if (loggedInUser || nickname.trim().length >= 3) {
      setPaymentStep('method');
    } else {
      setPaymentStep('nickname');
    }
  };

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || nickname.trim().length < 3) {
      setFormError('Будь ласка, вкажіть ваш справжній ігровий нікнейм від 3 символів.');
      return;
    }
    setFormError('');
    setPaymentStep('method');
  };

  const handleMethodSelection = (method: 'card' | 'monobank' | 'applepay') => {
    setPaymentMethod(method);
    if (method === 'monobank' || method === 'applepay') {
      // Simulate fast checkouts directly without card forms
      triggerMockProcessing();
    } else {
      setPaymentStep('card');
    }
  };

  const validateCardDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setFormError('Некоректний номер карти! Має бути 16 цифр.');
      return;
    }
    if (!cardExpiry.includes('/') || cardExpiry.length !== 5) {
      setFormError('Некоректний термін дії (формат: ММ/РР)!');
      return;
    }
    if (cardCvv.length !== 3) {
      setFormError('Некоректний CVV код!');
      return;
    }
    if (cardName.trim().length < 4) {
      setFormError('Напишіть ім\'я власника карти!');
      return;
    }
    
    setFormError('');
    triggerMockProcessing();
  };

  const triggerMockProcessing = () => {
    setPaymentStep('processing');
    
    // Simulate payment bank networks delayed verification for ultimate realistic immersion
    setTimeout(() => {
      completePurchase();
    }, 3000);
  };

  const completePurchase = async () => {
    if (!selectedItem) return;
    try {
      const pm = paymentMethod === 'card' ? 'VISA/MASTERCARD' :
                 paymentMethod === 'monobank' ? 'MONOBANK API' : 'APPLE PAY';

      await onPurchaseComplete({
        nickname: nickname.trim(),
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        itemCategory: selectedItem.category,
        price: selectedItem.price,
        paymentMethod: pm
      });

      setPaymentStep('success');
    } catch (err) {
      setFormError('Помилка сервера при обробці замовлення. Спробуйте ще раз!');
      setPaymentStep('method');
    }
  };

  const resetPaymentForm = () => {
    setSelectedItem(null);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setFormError('');
  };

  return (
    <div id="shop-tab-view" className="space-y-12 py-8 font-sans">
      
      {/* Banner / Header */}
      <section className="bg-gradient-to-br from-indigo-950/25 via-[#121216] to-[#0a0a0c] border border-white/10 rounded-3xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 coords-grid opacity-15 pointer-events-none" />
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] font-black uppercase tracking-widest">
            Diamant Shop UA 🇺🇦
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
            Офіційний Магазин Допомоги серверу Diamant SMP
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
            Всі виручені кошти спрямовуються на щомісячну оплату оренди фізичного виділеного сервера у хостингу, роботу розробників, оплату реклами та вдосконалення античіта. Купуючи привілеї, ви забезпечуєте майбутнє нашого SMP проекту!
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-3 text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Швидка видача за 1-3 хв</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-indigo-400" />
              <span>Безпечні українські платежі</span>
            </span>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex space-x-2">
          {(['all', 'ranks', 'items'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-mono text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/30'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'all' ? 'Всі Товари' :
               cat === 'ranks' ? '🎖️ Преміум Ранги' : '💎 Смарагди/Ключі'}
            </button>
          ))}
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-[9px] font-mono text-gray-500 uppercase font-black leading-none">Підключайся за ніком в грі</p>
          <p className="text-xs font-mono font-bold text-indigo-400">{loggedInUser ? `Авторизовано: ${loggedInUser}` : 'Гість'}</p>
        </div>
      </div>

      {/* Main Grid display selector */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {filteredItems.map(item => {
          const isRank = item.category === 'ranks';
          return (
            <div
              key={item.id}
              className="bg-[#0f0f13] border border-white/10 rounded-3xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 duration-300 relative group overflow-hidden"
            >
              {isRank && (
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-indigo-600/10 blur-[30px] rounded-full pointer-events-none" />
              )}
              
              <div>
                {/* Visual Icon Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`p-2.5 rounded-xl border text-base ${
                    isRank ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' : 'bg-purple-600/10 border-purple-500/20 text-purple-400'
                  }`}>
                    {item.id === 'wanderer' ? '⚔️' :
                     item.id === 'knight' ? '🛡️' :
                     item.id === 'lord' ? '🔮' :
                     item.id === 'king' ? '👑' :
                     item.id === 'legendary_key' ? '🔑' : '💎'}
                  </span>
                  
                  <span className={`text-[8px] font-mono px-2 py-1 rounded-lg font-black uppercase tracking-widest leading-none ${
                    isRank ? 'bg-indigo-600/10 text-indigo-450 border border-indigo-500/10 text-indigo-400' : 'bg-purple-600/10 text-purple-400 border border-purple-500/10'
                  }`}>
                    {isRank ? 'Привілегія' : 'Ресурс'}
                  </span>
                </div>

                {/* Name & price info */}
                <h3 className="font-mono text-xs font-black uppercase tracking-wider text-white mb-2 leading-snug">{item.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4 font-medium">{item.description}</p>

                {/* Features details list if Rank */}
                {isRank && item.features && (
                  <ul className="space-y-1.5 border-t border-white/5 pt-3 mb-6 font-sans text-xs text-gray-400 font-medium">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5 leading-tight">
                        <Check className="w-3.5 h-3.5 text-indigo-450 shrink-0 mt-0.5 text-indigo-400" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Purchase Button Block */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between gap-2 mt-4">
                <div>
                  <p className="text-[8px] font-mono text-gray-500 leading-none uppercase font-black">До сплати</p>
                  <p className="text-xl font-mono font-black text-white leading-tight">
                    ₴{item.price}
                  </p>
                </div>
                
                <button
                  onClick={() => openPayment(item)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] uppercase font-black tracking-widest rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <span>Купити</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </section>

      {/* Payment Gateway SIMULATOR UI Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0f0f13] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative" id="payment-modal">
            
            {/* Modal Header */}
            <div className="bg-[#050507] p-4 px-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                <span className="font-mono text-xs font-black uppercase tracking-wider text-white">Верифікація оплати</span>
              </div>
              <button
                onClick={resetPaymentForm}
                className="text-gray-400 hover:text-white font-mono text-[10px] font-bold bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg uppercase tracking-wider transition-colors"
              >
                Скасувати
              </button>
            </div>

            {/* Error alerts banner */}
            {formError && (
              <div className="bg-red-500/10 border-b border-red-500/20 p-3 px-6 text-xs font-mono text-red-400 font-bold uppercase tracking-wide">
                🚨 Помилка: {formError}
              </div>
            )}

            {/* Step Content Renderers */}
            
            {/* Step 1: Input MC Name */}
            {paymentStep === 'nickname' && (
              <form onSubmit={handleNicknameSubmit} className="p-6 space-y-5">
                <div className="text-center space-y-1.5 pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans text-base font-bold text-white uppercase tracking-tight">Введіть ваш нікнейм у грі</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto font-medium">
                    На вказаний нікнейм буде автоматично зачислено обрану привілегію!
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-gray-500 uppercase font-black tracking-widest">Ігровий Nickname:</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    placeholder="Приклад: DiamantBuilder_Ua"
                    required
                    maxLength={16}
                    className="w-full bg-white/5 border border-white/10 rounded-xl outline-none px-4 py-3 font-mono text-xs text-white focus:border-indigo-500 placeholder-gray-650 transition-colors"
                  />
                </div>

                <div className="p-4 bg-white/5 rounded-2xl text-[10.5px] border border-white/5 font-mono text-gray-400 tracking-wide leading-relaxed uppercase">
                  ⚠️ Переконайтеся, що нікнейм написаний без помилок! Кошти за помилково вказані нікнейми не повертаються.
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition-all outline-none shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  ПРОДОВЖИТИ
                </button>
              </form>
            )}

            {/* Step 2: Choose Payment Method styled as real Ukr Banks */}
            {paymentStep === 'method' && (
              <div className="p-6 space-y-6">
                
                {/* Checkout Item summary card */}
                <div className="bg-[#050507] border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-[8px] font-mono text-gray-500 uppercase leading-none font-black">Для гравця: <span className="text-indigo-400 font-bold">{nickname}</span></p>
                    <p className="text-xs font-mono font-black text-white uppercase tracking-wider leading-snug mt-1">{selectedItem.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-mono text-gray-500 uppercase leading-none font-black">До сплати</p>
                    <p className="text-base font-mono font-black text-indigo-400 leading-none mt-1">₴{selectedItem.price}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-[9px] text-gray-500 uppercase font-black tracking-widest font-bold">Оберіть карту або гаманець:</p>
                  
                  {/* MonoBank simulated button */}
                  <div
                    onClick={() => handleMethodSelection('monobank')}
                    className="flex items-center justify-between p-4 bg-[#111111] hover:bg-[#191919] border border-white/10 hover:border-pink-500/50 rounded-2xl cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-pink-500/10 rounded-xl text-pink-500 font-extrabold text-[10px]">
                        🐱 MONO
                      </div>
                      <div className="text-left font-sans">
                        <p className="text-xs font-bold text-white uppercase tracking-tight">МоноБанк Оплата</p>
                        <p className="text-[10px] text-gray-400 font-medium">Миттєве підтвердження в застосунку Mono</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-pink-400 font-mono uppercase font-black tracking-wider group-hover:underline">Вибрати →</span>
                  </div>

                  {/* Visa Mastercard traditional simulated credit card gate */}
                  <div
                    onClick={() => handleMethodSelection('card')}
                    className="flex items-center justify-between p-4 bg-[#0f111a] hover:bg-[#151824] border border-white/10 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="text-left font-sans">
                        <p className="text-xs font-bold text-white uppercase tracking-tight">Картка VISA / MasterCard</p>
                        <p className="text-[10px] text-gray-400 font-medium font-sans">Оплата банківською карткою через WayForPay</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono uppercase font-black tracking-wider group-hover:underline">Вибрати →</span>
                  </div>

                  {/* Apple Pay fast checkout simulation */}
                  <div
                    onClick={() => handleMethodSelection('applepay')}
                    className="flex items-center justify-between p-4 bg-black hover:bg-[#070709] border border-white/10 hover:border-white/30 rounded-2xl cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-neutral-900 rounded-xl text-white">
                        <Apple className="w-5 h-5 fill-white" />
                      </div>
                      <div className="text-left font-sans">
                        <p className="text-xs font-bold text-white uppercase tracking-tight">Apple Pay / G-Pay</p>
                        <p className="text-[10px] text-gray-400 font-medium">Миттєва авторизація за допомогою смартфона</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/50 font-mono uppercase font-black tracking-wider group-hover:underline">Вибрати →</span>
                  </div>

                </div>

                <div className="text-center font-mono text-[8px] text-gray-500 uppercase leading-none font-black tracking-widest">
                  🛡️ ТРАНЗАКЦІЇ ЗАХИЩЕНІ 256-BIT SSL ШИФРУВАННЯМ
                </div>

              </div>
            )}

            {/* Step 3: Card Details Input form */}
            {paymentStep === 'card' && (
              <form onSubmit={validateCardDetails} className="p-6 space-y-5">
                
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">Шлюз WayForPay</span>
                  <span className="font-mono text-xs font-black text-indigo-400">₴{selectedItem.price}</span>
                </div>

                {/* Simulated Card design placeholder preview */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-800 p-5 rounded-3xl relative shadow-lg text-white font-mono space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black italic tracking-wider">Diamant Billing</span>
                    <span className="text-xs font-semibold">💳 CARD</span>
                  </div>
                  <div>
                    <p className="text-[7px] text-white/50 leading-none mb-1 font-black">НОМЕР КАРТКИ</p>
                    <p className="text-sm font-bold tracking-widest">{cardNumber || '•••• •••• •••• ••••'}</p>
                  </div>
                  <div className="flex justify-between items-end gap-2">
                    <div className="flex-1">
                      <p className="text-[7px] text-white/50 leading-none mb-1 font-black">ВЛАСНИК</p>
                      <p className="text-[11px] font-black truncate uppercase">{cardName || 'YOUR FULL NAME'}</p>
                    </div>
                    <div className="w-16">
                      <p className="text-[7px] text-white/50 leading-none mb-1 font-black">ТЕРМІН</p>
                      <p className="text-[11px] font-black">{cardExpiry || 'ММ/РР'}</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-gray-500 uppercase font-black tracking-widest">16-значний номер картки:</label>
                    <input
                      type="text"
                      maxLength={19} // space separated
                      placeholder="4441 1111 2222 3333"
                      value={cardNumber}
                      required
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/gi, '');
                        const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean;
                        setCardNumber(formatted.slice(0, 19));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl outline-none px-4 py-2.5 font-mono text-xs text-white focus:border-indigo-500 placeholder-gray-650 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-gray-500 uppercase font-black tracking-widest">Дійсна до (MM/YY):</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="12/28"
                        required
                        value={cardExpiry}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/gi, '');
                          let formatted = clean;
                          if (clean.length > 2) {
                            formatted = clean.slice(0, 2) + '/' + clean.slice(2, 4);
                          }
                          setCardExpiry(formatted);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl outline-none px-4 py-2.5 font-mono text-xs text-white focus:border-indigo-500 placeholder-gray-650 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-gray-500 uppercase font-black tracking-widest">Код CVV:</label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="•••"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/gi, '').slice(0, 3))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl outline-none px-4 py-2.5 font-mono text-xs text-white focus:border-indigo-500 placeholder-gray-650 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-gray-500 uppercase font-black tracking-widest">Власник картки (Латиницею):</label>
                    <input
                      type="text"
                      placeholder="IVAN PETRENKO"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 26))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl outline-none px-4 py-2.5 font-mono text-xs text-white focus:border-indigo-500 placeholder-gray-650 transition-colors uppercase"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-sans p-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Шлюз захищено протоколами 3D-Secure 2.0 та сертифікатом PCI-DSS Level 1.</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStep('method')}
                    className="w-1/3 border border-white/10 hover:bg-white/5 text-gray-300 font-mono text-xs font-bold uppercase rounded-xl transition-all outline-none py-3"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black uppercase tracking-widest py-3 rounded-xl transition-all outline-none shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    Сплатити ₴{selectedItem.price}
                  </button>
                </div>

              </form>
            )}

            {/* Step 4: Loading Bank state spin */}
            {paymentStep === 'processing' && (
              <div className="p-12 text-center space-y-6">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto animate-infinite" />
                
                <div className="space-y-2">
                  <h3 className="font-sans text-base font-bold text-white uppercase tracking-tight">Обробка безпечного платежу</h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto font-medium">
                    Зв'язуємося з платіжним шлюзом WayForPay для проведення транзакції. Будь ласка, не закривайте вкладку...
                  </p>
                </div>

                <div className="font-mono text-[9px] text-gray-500 uppercase leading-none tracking-widest font-black pl-2">
                  🔒 SECURING TRANSACTION...
                </div>
              </div>
            )}

            {/* Step 5: Successful completion summary message */}
            {paymentStep === 'success' && (
              <div className="p-8 text-center space-y-6">
                
                <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                  <Check className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-sans text-lg font-black text-white uppercase tracking-tight">Оплата Отримала статус: Успішно</h3>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto font-medium">
                    Вітаємо, <span className="text-indigo-400 font-bold">{nickname}</span>! Банк підтвердив платіж. Товар <span className="font-bold text-white">{selectedItem.name}</span> успішно зараховано на ваш ігровий аккаунт.
                  </p>
                </div>

                <div className="bg-[#050507] border border-white/10 rounded-2xl p-4 text-left font-mono text-[10px] space-y-2 max-w-sm mx-auto uppercase tracking-wide">
                  <p className="text-gray-500 uppercase text-[8px] font-black">Офіційний фіскальний чек:</p>
                  <div className="flex justify-between text-gray-400">
                    <span>Отримувач:</span>
                    <span className="text-white font-bold">{nickname}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Товар:</span>
                    <span className="text-white truncate max-w-[150px]">{selectedItem.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Сума:</span>
                    <span className="text-indigo-400 font-bold">₴{selectedItem.price}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Спосіб:</span>
                    <span className="text-white font-bold">{paymentMethod === 'card' ? 'Visa/Mastercard' : paymentMethod === 'monobank' ? 'Monobank' : 'Apple Pay'}</span>
                  </div>
                </div>

                <button
                  onClick={resetPaymentForm}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition-all outline-none max-w-sm mx-auto cursor-pointer"
                >
                  Повернутися у Магазин
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
