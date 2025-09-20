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
  addSuspiciousLog: (log: SuspiciousLog, onAutoBan?: (user: User) => void) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  clearChat: () => void;
}

const AUTO_BAN_THRESHOLD = 10;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        { id: 'admin', name: 'Admin', email: 'admin@drugshield.ai', phone: 'N/A', status: 'active' }
      ],
      messages: [],
      suspiciousLogs: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      addSuspiciousLog: (log, onAutoBan) => {
        const { suspiciousLogs, banUser } = get();
        const updatedLogs = [...suspiciousLogs, log].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        const userLogCount = updatedLogs.filter(l => l.user.id === log.user.id).length;
        
        set({ suspiciousLogs: updatedLogs });

        if (userLogCount >= AUTO_BAN_THRESHOLD && log.user.status === 'active') {
          banUser(log.user.id);
          if (onAutoBan) {
            const bannedUser = get().users.find(u => u.id === log.user.id);
            if(bannedUser) {
               onAutoBan(bannedUser);
            }
          }
        }
      },
      banUser: (userId) => set((state) => ({
          users: state.users.map(u => u.id === userId ? { ...u, status: 'banned' } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, status: 'banned' } : state.currentUser,
          suspiciousLogs: state.suspiciousLogs.map(log => log.user.id === userId ? { ...log, user: { ...log.user, status: 'banned' } } : log)
      })),
      unbanUser: (userId: string) => set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, status: 'active' } : u),
        currentUser: state.currentUser?.id === userId ? { ...state.currentUser, status: 'active' } : state.currentUser,
        suspiciousLogs: state.suspiciousLogs.map(log => log.user.id === userId ? { ...log, user: { ...log.user, status: 'active' } } : log)
      })),
      clearChat: () => set({ messages: [], suspiciousLogs: [] }),
    }),
    {
      name: 'drugshield-ai-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);
