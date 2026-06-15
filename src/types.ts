export type RankType = 'default' | 'wanderer' | 'knight' | 'lord' | 'king';

export interface Player {
  id: string;
  name: string;
  rank: RankType;
  balance: number; // in-game Emerald coins
  donorBalance: number; // premium smaragds
  playtime: number; // in hours
  deaths: number;
  mobKills: number;
  minedSmaragds: number;
  isOnline: boolean;
  skinUrl?: string; // mojang or simulated
  registeredAt: string;
  lastSeen: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'ranks' | 'items';
  features?: string[];
  icon: string;
}

export interface Order {
  id: string;
  playerNickname: string;
  itemId: string;
  itemName: string;
  itemCategory: 'ranks' | 'items';
  price: number;
  timestamp: string;
  status: 'pending' | 'success';
  paymentMethod: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  rank: RankType;
  text: string;
  time: string;
}

export interface ServerStats {
  onlineCount: number;
  maxPlayers: number;
  tps: number;
  cpu: number;
  ramUsage: number; // GB
  ramMax: number; // GB
  totalRegistered: number;
  serverIp: string;
  serverPort: number;
  version: string;
}
