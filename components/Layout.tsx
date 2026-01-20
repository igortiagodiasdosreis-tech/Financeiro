
import React from 'react';
import { 
  Library, History, Heart, CalendarDays, 
  CreditCard, Download, Settings, Bell, 
  Plus, PenTool, BookOpen, ScrollText, LogOut, User as UserIcon, ShieldCheck, Database, HardDrive, Cloud
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExport: () => void;
  onQuickAdd?: () => void;
  unreadNotifications: number;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, onExport, onQuickAdd, unreadNotifications, syncStatus, user, onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', icon: <Library className="w-5 h-5" />, label: 'O Ledger' },
    { id: 'history', icon: <History className="w-5 h-5" />, label: 'Anais' },
    { id: 'projects', icon: <Heart className="w-5 h-5" />, label: 'Sonhos' },
    { id: 'installments', icon: <CreditCard className="w-5 h-5" />, label: 'Dívidas' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Oficina' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-2 md:p-4 justify-center">
      <aside className="hidden md:flex w-64 flex-col pr-6 z-20">
        <div className="flex flex-col items-center mb-12 mt-8">
          <div className="w-20 h-20 bg-ink text-sepia-base rounded-full flex items-center justify-center shadow-2xl mb-4 border-2 border-accent/40 ring-4 ring-ink">
            <ScrollText className="w-10 h-10" />
          </div>
          <h1 className="script-font text-5xl text-sepia-light leading-none text-center">O Grande Ledger</h1>
          <div className="h-px w-24 bg-accent/40 mt-4"></div>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3 transition-all rounded-lg ${
                activeTab === item.id 
                  ? 'text-sepia-light bg-white/5 shadow-inner' 
                  : 'text-sepia-dark hover:text-sepia-light hover:bg-white/5'
              }`}
            >
              <span className={activeTab === item.id ? 'text-accent' : 'opacity-40'}>{item.icon}</span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Manômetro de Sincronia */}
        <div className="bg-ink/30 p-4 rounded-sm border border-accent/10 mb-6">
          <p className="text-[8px] uppercase font-black text-accent tracking-[0.3em] mb-3">Estado de Preservação</p>
          <div className="flex justify-around items-center">
            <div title="Local" className="flex flex-col items-center opacity-100">
               <Database className="w-3 h-3 text-emerald-500" />
               <span className="text-[6px] mt-1 text-emerald-500/50">LOCAL</span>
            </div>
            <div title="Google Cloud" className={`flex flex-col items-center transition-all ${user ? 'opacity-100' : 'opacity-20 grayscale'}`}>
               <Cloud className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-pulse text-accent' : 'text-sepia-base'}`} />
               <span className="text-[6px] mt-1 text-sepia-base/50">CLOUD</span>
            </div>
            <div title="Disco Rígido" className="flex flex-col items-center opacity-20 grayscale">
               <HardDrive className="w-3 h-3 text-sepia-base" />
               <span className="text-[6px] mt-1 text-sepia-base/50">DISCO</span>
            </div>
          </div>
          <div className="h-1 bg-white/5 mt-3 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${syncStatus === 'syncing' ? 'w-1/2 bg-accent' : syncStatus === 'success' ? 'w-full bg-emerald-500' : 'w-1/4 bg-white/20'}`} />
          </div>
        </div>

        <div className="mt-auto pb-8">
          {user && (
            <div className="px-4 flex items-center gap-3 mb-4">
              <img src={user.picture} className="w-8 h-8 rounded-full border border-accent/30" />
              <div className="flex-1 overflow-hidden">
                <p className="text-[9px] font-black text-sepia-light truncate uppercase">{user.name}</p>
                <button onClick={onLogout} className="text-[8px] text-red-900 font-bold uppercase hover:underline">Sair</button>
              </div>
            </div>
          )}
          <button onClick={onExport} className="flex items-center gap-3 text-sepia-dark hover:text-sepia-light transition-all text-[10px] uppercase tracking-widest px-5 font-black">
            <Download className="w-4 h-4" /> Exportar Ledger
          </button>
        </div>
      </aside>

      <div className="book-container flex-1 max-w-7xl relative overflow-hidden">
        <div className="book-spine hidden xl:block" />
        <header className="px-10 py-8 flex items-center justify-between border-b border-ink/10 z-20 bg-sepia-base/40 backdrop-blur-sm sticky top-0">
           <div className="flex items-center gap-4">
              <BookOpen className="w-6 h-6 text-ink opacity-40" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-ink opacity-30">Página de Balanço</span>
                <span className="text-xs italic font-bold text-ink/60">{activeTab}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <button onClick={() => setActiveTab('notifications')} className="relative text-ink hover:text-accent transition-colors">
                <Bell className="w-6 h-6 opacity-60" />
                {unreadNotifications > 0 && <span className="absolute -top-1 -right-1 bg-red-900 text-sepia-base text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">{unreadNotifications}</span>}
              </button>
              <button onClick={onQuickAdd} className="bg-ink text-sepia-base px-6 py-2 rounded-sm hover:scale-105 transition-all shadow-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                <Plus className="w-4 h-4" /> Novo Registro
              </button>
           </div>
        </header>

        <main key={activeTab} className="flex-1 overflow-y-auto p-10 lg:p-16 z-10 page-flip custom-ledger-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
