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
  text?: string; // Text is now optional for image messages
  imageUrl?: string; // For image messages
  timestamp: string;
  userId: string;
  isSuspicious?: boolean;
  suspicionCategory?: string; // e.g., NSFW, Violence
};

export type SuspiciousLog = {
  id: string;
  user: User;
  message?: string;
  imageUrl?: string;
  timestamp: string;
  confidenceScore: number;
  category?: string; // For image analysis
};
