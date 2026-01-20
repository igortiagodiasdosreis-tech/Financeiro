
import React from 'react';
import { 
  Book, History, Heart, CalendarDays, 
  CreditCard, Download, Settings, Bell, 
  Plus, PenTool, BookOpen, ScrollText, Library
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExport: () => void;
  onQuickAdd?: () => void;
  unreadNotifications: number;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, onExport, onQuickAdd, unreadNotifications 
}) => {
  const menuItems = [
    { id: 'dashboard', icon: <Library className="w-5 h-5" />, label: 'O Ledger' },
    { id: 'history', icon: <History className="w-5 h-5" />, label: 'Anais' },
    { id: 'planning', icon: <PenTool className="w-5 h-5" />, label: 'Escrutínio' },
    { id: 'calendar', icon: <CalendarDays className="w-5 h-5" />, label: 'Datas' },
    { id: 'projects', icon: <Heart className="w-5 h-5" />, label: 'Sonhos' },
    { id: 'installments', icon: <CreditCard className="w-5 h-5" />, label: 'Dívidas' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Oficina' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-2 md:p-4 justify-center">
      {/* Sidebar como Capa de Couro */}
      <aside className="hidden md:flex w-64 flex-col pr-6 z-20">
        <div className="flex flex-col items-center mb-12 mt-8">
          <div className="w-20 h-20 bg-ink text-sepia-base rounded-full flex items-center justify-center shadow-2xl mb-4 border-2 border-accent/40 ring-4 ring-ink">
            <ScrollText className="w-10 h-10" />
          </div>
          <h1 className="script-font text-5xl text-sepia-light leading-none text-center drop-shadow-md">O Grande Ledger</h1>
          <div className="h-px w-24 bg-accent/40 mt-4 mb-1"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-black">Crônicas do Tesouro</span>
        </div>

        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3 transition-all relative group rounded-lg ${
                activeTab === item.id 
                  ? 'text-sepia-light font-bold translate-x-2 bg-white/5 shadow-inner' 
                  : 'text-sepia-dark hover:text-sepia-light hover:bg-white/5'
              }`}
            >
              <div className={`absolute left-0 w-1.5 h-6 bg-accent rounded-full transition-all duration-300 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`} />
              <span className={activeTab === item.id ? 'text-accent' : 'opacity-60'}>{item.icon}</span>
              <span className="text-xs tracking-[0.2em] uppercase font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pb-8 space-y-4">
          <button 
            onClick={onExport}
            className="flex items-center gap-3 text-sepia-dark hover:text-sepia-light transition-all text-[10px] uppercase tracking-widest px-5 font-black"
          >
            <Download className="w-4 h-4" />
            Exportar Ledger
          </button>
        </div>
      </aside>

      {/* Container Principal do Livro */}
      <div className="book-container flex-1 max-w-7xl relative overflow-hidden">
        {/* Lombada Central Virtual */}
        <div className="book-spine hidden xl:block" />

        {/* Top Header interno ao livro */}
        <header className="px-10 py-8 flex items-center justify-between border-b border-ink/10 z-20 bg-sepia-base/40 backdrop-blur-sm sticky top-0">
           <div className="flex items-center gap-4">
              <BookOpen className="w-6 h-6 text-ink opacity-40" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-ink opacity-30">Folha de Balanço Atual</span>
                <span className="text-xs italic font-bold text-ink/60">Registros do Mês Corrente</span>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <button onClick={() => setActiveTab('notifications')} className="relative text-ink hover:text-accent transition-colors">
                <Bell className="w-6 h-6 opacity-60" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-ink text-sepia-base text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-sepia-base shadow-lg">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button 
                onClick={onQuickAdd}
                className="bg-ink text-sepia-base px-5 py-2 rounded-sm hover:scale-105 transition-all shadow-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Novo Registro
              </button>
           </div>
        </header>

        {/* Área de Conteúdo (Páginas do Livro) */}
        {/* A chave key={activeTab} força o React a remontar o elemento e disparar a animação CSS a cada troca de aba */}
        <main key={activeTab} className="flex-1 overflow-y-auto p-10 lg:p-16 z-10 page-flip custom-ledger-scroll">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* Rodapé Interno */}
        <footer className="px-10 py-6 border-t border-ink/5 flex justify-between items-center opacity-40 text-[10px] uppercase tracking-[0.3em] font-black mt-auto">
          <div className="flex items-center gap-2">
            <PenTool className="w-3 h-3" />
            <span>Sistema de Escrituração Ledger v3.5</span>
          </div>
          <span>Página {menuItems.findIndex(i => i.id === activeTab) + 1} de {menuItems.length}</span>
        </footer>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-ink text-sepia-base rounded-2xl p-4 flex items-center justify-around shadow-2xl border border-accent ring-4 ring-ink/20">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-accent' : ''}><Library className="w-6 h-6" /></button>
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-accent' : ''}><History className="w-6 h-6" /></button>
        <button onClick={onQuickAdd} className="bg-accent text-ink p-4 rounded-full -mt-12 border-4 border-ink shadow-2xl active:scale-90 transition-all"><Plus className="w-7 h-7" /></button>
        <button onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? 'text-accent' : ''}><Heart className="w-6 h-6" /></button>
        <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'text-accent' : ''}><Settings className="w-6 h-6" /></button>
      </nav>
    </div>
  );
};

export default Layout;
