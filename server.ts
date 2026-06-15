import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Player, ShopItem, Order, ChatMessage, ServerStats, RankType } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// IN-MEMORY DATABASE & SIMULATOR
let serverStats: ServerStats = {
  onlineCount: 14,
  maxPlayers: 100,
  tps: 19.95,
  cpu: 18.4,
  ramUsage: 4.82,
  ramMax: 16.0,
  totalRegistered: 1148,
  serverIp: "72.62.119.240",
  serverPort: 29667,
  version: "1.21.11"
};

const initialPlayers: Player[] = [
  { id: "1", name: "DiamantOwner", rank: "king", balance: 14500, donorBalance: 450, playtime: 240, deaths: 12, mobKills: 3840, minedSmaragds: 284, isOnline: true, registeredAt: "2026-01-10T12:00:00Z", lastSeen: "Active" },
  { id: "2", name: "YaroslavSky", rank: "lord", balance: 8200, donorBalance: 120, playtime: 115, deaths: 4, mobKills: 1420, minedSmaragds: 121, isOnline: true, registeredAt: "2026-02-14T15:30:00Z", lastSeen: "Active" },
  { id: "3", name: "ProMinerUA", rank: "default", balance: 3400, donorBalance: 0, playtime: 88, deaths: 23, mobKills: 1980, minedSmaragds: 98, isOnline: true, registeredAt: "2026-03-01T08:14:00Z", lastSeen: "Active" },
  { id: "4", name: "Bandera_Minecraft", rank: "knight", balance: 6710, donorBalance: 10, playtime: 95, deaths: 15, mobKills: 2050, minedSmaragds: 86, isOnline: true, registeredAt: "2026-01-15T21:44:00Z", lastSeen: "Active" },
  { id: "5", name: "Danya_Cossack", rank: "wanderer", balance: 2100, donorBalance: 40, playtime: 42, deaths: 8, mobKills: 780, minedSmaragds: 32, isOnline: true, registeredAt: "2026-04-10T19:22:00Z", lastSeen: "Active" },
  { id: "6", name: "Ksenia_Green", rank: "lord", balance: 11200, donorBalance: 150, playtime: 180, deaths: 19, mobKills: 2900, minedSmaragds: 194, isOnline: false, registeredAt: "2026-02-05T14:10:00Z", lastSeen: "2 години тому" },
  { id: "7", name: "Andriy_Warrior", rank: "knight", balance: 4120, donorBalance: 0, playtime: 51, deaths: 11, mobKills: 1100, minedSmaragds: 54, isOnline: false, registeredAt: "2026-05-18T10:05:00Z", lastSeen: "1 день тому" },
  { id: "8", name: "Taras_Builder", rank: "default", balance: 1920, donorBalance: 0, playtime: 34, deaths: 3, mobKills: 450, minedSmaragds: 12, isOnline: false, registeredAt: "2026-05-25T17:12:00Z", lastSeen: "3 години тому" },
  { id: "9", name: "Melody_Cat", rank: "wanderer", balance: 3300, donorBalance: 30, playtime: 67, deaths: 14, mobKills: 920, minedSmaragds: 45, isOnline: false, registeredAt: "2026-03-12T11:40:00Z", lastSeen: "10 хвилин тому" }
];

let players: Player[] = [...initialPlayers];

let orders: Order[] = [
  { id: "tr_1", playerNickname: "YaroslavSky", itemId: "lord", itemName: "Ранг Володар (Lord)", itemCategory: "ranks", price: 299, timestamp: "2026-06-14T19:40:00Z", status: "success", paymentMethod: "MONOBANK" },
  { id: "tr_2", playerNickname: "Danya_Cossack", itemId: "wanderer", itemName: "Ранг Мандрівник (Wanderer)", itemCategory: "ranks", price: 49, timestamp: "2026-06-14T20:12:00Z", status: "success", paymentMethod: "VISA/MASTERCARD" },
  { id: "tr_3", playerNickname: "Melody_Cat", itemId: "items_500", itemName: "500 Смарагдів у гру", itemCategory: "items", price: 50, timestamp: "2026-06-14T21:15:00Z", status: "success", paymentMethod: "APPLE_PAY" }
];

let chatMessages: ChatMessage[] = [
  { id: "ch_1", sender: "DiamantOwner", rank: "king", text: "Усім привіт! Ласкаво просимо на Diamant SMP!", time: "22:20" },
  { id: "ch_2", sender: "YaroslavSky", rank: "lord", text: "Хтось хоче обміняти алмази на залізо? Чекаю на спавні.", time: "22:21" },
  { id: "ch_3", sender: "ProMinerUA", rank: "default", text: "Я вчора знайшов цілий спавнер павуків, роблю ферму досвіду.", time: "22:23" },
  { id: "ch_4", sender: "Bandera_Minecraft", rank: "knight", text: "Слава Україні! Хлопці, обережно, в пеклі біля фортеці багато лави.", time: "22:24" },
  { id: "ch_5", sender: "Danya_Cossack", rank: "wanderer", text: "Дякую за попередження! Хто збудував той класний вітряк на координатах 200 -400?", time: "22:27" }
];

// LIST OF UKRAINIAN MINE CHAT SAMPLES FOR SIMULATION
const simChatPool = [
  { sender: "ProMinerUA", rank: "default" as RankType, text: "Шукаю жителя з книжкою Мудрість 3, хто має?" },
  { sender: "Bandera_Minecraft", rank: "knight" as RankType, text: "Продаю чарівні яблука по 5 смарагдів за шуку." },
  { sender: "Melody_Cat", rank: "wanderer" as RankType, text: "Мій пес застряг у човні, допоможіть витягти хахаха" },
  { sender: "Taras_Builder", rank: "default" as RankType, text: "Будую козацьку фортецю на пагорбі, потрібен дуб." },
  { sender: "DiamantOwner", rank: "king" as RankType, text: "Нагадую, гриферство та використання читів заборонено!" },
  { sender: "YaroslavSky", rank: "lord" as RankType, text: "О, я змайстрував собі елітри з нарешті переміг Ендер Дракона!" },
  { sender: "Danya_Cossack", rank: "wanderer" as RankType, text: "Які гарні краєвиди біля річки, найкращий український майнкрафт!" },
  { sender: "SteveUa", rank: "default" as RankType, text: "Привіт усім! Хто в мережі, пішли в Енд?" },
  { sender: "Andriy_Warrior", rank: "knight" as RankType, text: "Захистив село від набігу розбійників, отримав Героя Села!" }
];

// SIMULATION PERIODICS
setInterval(() => {
  // 1. Sim chat message
  const randomChat = simChatPool[Math.floor(Math.random() * simChatPool.length)];
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  
  chatMessages.push({
    id: `ch_${Date.now()}`,
    sender: randomChat.sender,
    rank: randomChat.rank,
    text: randomChat.text,
    time: timeStr
  });
  if (chatMessages.length > 30) chatMessages.shift();

  // 2. Sim player stats change & online shifts
  serverStats.onlineCount = Math.max(5, Math.min(65, serverStats.onlineCount + (Math.random() > 0.5 ? 1 : -1)));
  serverStats.tps = Number((19.8 + Math.random() * 0.2).toFixed(2));
  serverStats.cpu = Number((10 + Math.random() * 20).toFixed(1));
  serverStats.ramUsage = Number((4.1 + Math.random() * 1.5).toFixed(2));

  // Modify some active players statistics slightly
  players = players.map(p => {
    if (p.isOnline) {
      return {
        ...p,
        playtime: p.playtime + Number((Math.random() * 0.05).toFixed(3)),
        mobKills: p.mobKills + (Math.random() > 0.7 ? 1 : 0),
        minedSmaragds: p.minedSmaragds + (Math.random() > 0.9 ? 1 : 0),
        balance: p.balance + (Math.random() > 0.8 ? 10 : 0)
      };
    }
    return p;
  });
}, 12000);

// API ROUTES
app.get("/api/stats", (req, res) => {
  res.json({
    stats: serverStats,
    players: players.sort((a,b) => b.playtime - a.playtime),
    orders: orders.slice(0, 30),
    chat: chatMessages
  });
});

app.post("/api/register", (req, res) => {
  const { nickname } = req.body;
  
  if (!nickname || typeof nickname !== "string" || nickname.trim().length === 0) {
    return res.status(400).json({ error: "Введіть коректний нікнейм!" });
  }

  const cleanNick = nickname.replace(/[^a-zA-Z0-9_]/g, "").trim();
  if (cleanNick.length < 3 || cleanNick.length > 16) {
    return res.status(400).json({ error: "Нікнейм повинен містити від 3 до 16 латинських літер чи цифр." });
  }

  // Find or Create
  let player = players.find(p => p.name.toLowerCase() === cleanNick.toLowerCase());
  
  if (!player) {
    player = {
      id: `p_${Date.now()}`,
      name: cleanNick,
      rank: 'default',
      balance: 100, // Starter balance
      donorBalance: 0,
      playtime: 0,
      deaths: 0,
      mobKills: 0,
      minedSmaragds: 0,
      isOnline: false,
      registeredAt: new Date().toISOString(),
      lastSeen: "Щойно зареєстрований"
    };
    players.push(player);
    serverStats.totalRegistered += 1;
  }

  res.json({ success: true, player });
});

app.post("/api/chat", (req, res) => {
  const { nickname, text } = req.body;
  if (!nickname || !text || text.trim().length === 0) {
    return res.status(400).json({ error: "Некоректні дані" });
  }

  const player = players.find(p => p.name.toLowerCase() === nickname.toLowerCase());
  const rank = player ? player.rank : "default";

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const newMessage: ChatMessage = {
    id: `ch_${Date.now()}`,
    sender: `[Web] ${nickname}`,
    rank,
    text: text.slice(0, 100),
    time: timeStr
  };

  chatMessages.push(newMessage);
  if (chatMessages.length > 30) chatMessages.shift();

  res.json({ success: true, message: newMessage });
});

app.post("/api/purchase", (req, res) => {
  const { nickname, itemId, price, paymentMethod, itemName, itemCategory } = req.body;

  if (!nickname || !itemId || !price) {
    return res.status(400).json({ error: "Відсутні обов'язкові параметри покупки." });
  }

  // Verify or Create player first
  let player = players.find(p => p.name.toLowerCase() === nickname.trim().toLowerCase());
  if (!player) {
    player = {
      id: `p_${Date.now()}`,
      name: nickname.trim(),
      rank: 'default',
      balance: 100,
      donorBalance: 0,
      playtime: 0,
      deaths: 0,
      mobKills: 0,
      minedSmaragds: 0,
      isOnline: false,
      registeredAt: new Date().toISOString(),
      lastSeen: "Зареєстрований через магазин"
    };
    players.push(player);
    serverStats.totalRegistered += 1;
  }

  // Award rank or donor balance
  if (itemCategory === 'ranks') {
    player.rank = itemId as RankType;
  } else if (itemId === 'items_500') {
    player.donorBalance += 500;
  } else if (itemId === 'items_1200') {
    player.donorBalance += 1200;
  } else if (itemId === 'legendary_key') {
    player.donorBalance += 200; // key value premium exchange
  }

  // Create real order
  const newOrder: Order = {
    id: `tr_${Date.now()}`,
    playerNickname: player.name,
    itemId,
    itemName,
    itemCategory,
    price,
    timestamp: new Date().toISOString(),
    status: 'success',
    paymentMethod: paymentMethod || "VISA/MASTERCARD"
  };

  orders.unshift(newOrder);

  // Send announcement to chat
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  chatMessages.push({
    id: `ch_ann_${Date.now()}`,
    sender: "§a[МАГАЗИН]§r",
    rank: "king", // System highlight
    text: `Гравець ${player.name} придбав ${itemName}! Дякуємо за підтримку сервера!`,
    time: timeStr
  });

  res.json({ success: true, order: newOrder, player });
});

// For update profile exchanges
app.post("/api/profile/exchange", (req, res) => {
  const { nickname, donorAmount } = req.body;
  if (!nickname || !donorAmount || donorAmount <= 0) {
    return res.status(400).json({ error: "Некоректні дані обміну." });
  }

  const p = players.find(x => x.name.toLowerCase() === nickname.toLowerCase());
  if (!p) {
    return res.status(404).json({ error: "Гравця не знайдено." });
  }

  if (p.donorBalance < donorAmount) {
    return res.status(400).json({ error: "Недостатньо преміум смарагдів!" });
  }

  // 1 Premium smaragd = 100 standard Emerald in-game coins
  const inGameReward = donorAmount * 100;
  p.donorBalance -= donorAmount;
  p.balance += inGameReward;

  res.json({ success: true, player: p, exgReward: inGameReward });
});

// START EXPRESS/VITE WORKFLOW
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Minecraft Server Hub running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
