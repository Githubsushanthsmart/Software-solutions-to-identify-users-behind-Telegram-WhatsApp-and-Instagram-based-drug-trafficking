export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  isSuspicious?: boolean;
};

export type SuspiciousLog = {
  id:string;
  user: User;
  message: string;
  timestamp: string;
  confidenceScore: number;
};
