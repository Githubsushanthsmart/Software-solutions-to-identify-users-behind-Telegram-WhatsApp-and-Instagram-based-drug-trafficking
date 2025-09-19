import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Message, SuspiciousLog } from '@/lib/types';

interface AppState {
  currentUser: User | null;
  users: User[];
  messages: Message[];
  suspiciousLogs: SuspiciousLog[];
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  addMessage: (message: Message) => void;
  addSuspiciousLog: (log: SuspiciousLog) => void;
  banUser: (userId: string) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: [
        { id: 'admin', name: 'Admin', email: 'admin@drugshield.ai', phone: 'N/A', status: 'active' }
      ],
      messages: [],
      suspiciousLogs: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      addSuspiciousLog: (log) => set((state) => ({
        suspiciousLogs: [...state.suspiciousLogs, log].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      })),
      banUser: (userId) => set((state) => ({
          users: state.users.map(u => u.id === userId ? { ...u, status: 'banned' } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, status: 'banned' } : state.currentUser,
          suspiciousLogs: state.suspiciousLogs.map(log => log.user.id === userId ? { ...log, user: { ...log.user, status: 'banned' } } : log)
      })),
      clearChat: () => set({ messages: [], suspiciousLogs: [] }),
    }),
    {
      name: 'drugshield-ai-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);
