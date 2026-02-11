
export type View = 'auth' | 'pin' | 'home' | 'live' | 'scan' | 'wallet' | 'chat' | 'orders' | 'product';

export interface Order {
  id: string;
  item: string;
  status: 'pending' | 'shipping' | 'completed';
  price: string;
  date: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export interface Product {
  id: number;
  user: string;
  desc: string;
  video: string;
  likes: string;
  price: string;
  thumbnail: string;
}
