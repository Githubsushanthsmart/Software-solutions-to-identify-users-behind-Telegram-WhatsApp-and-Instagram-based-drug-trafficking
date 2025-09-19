export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'banned';
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type Message = {
  id: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string; // For audio messages
  timestamp: string;
  userId: string;
  isSuspicious?: boolean;
  suspicionCategory?: string;
  transcription?: string; // For audio messages
};

export type SuspiciousLog = {
  id: string;
  user: User;
  message?: string;
  imageUrl?: string;
  audioUrl?: string;
  transcription?: string;
  timestamp: string;
  confidenceScore: number;
  category?: string;
};
