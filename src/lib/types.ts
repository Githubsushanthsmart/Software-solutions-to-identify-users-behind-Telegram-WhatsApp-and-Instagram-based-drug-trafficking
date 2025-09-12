export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
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
