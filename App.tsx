
import React, { useState, useEffect, useMemo } from 'react';
import { Landmark, HardDrive, CloudSync } from 'lucide-react';
import { 
  Transaction, TransactionType, Category, Emotion, 
  InstallmentPlan, LifeProject, Notification, Reminder, 
  BankConnection, SyncConfig, INITIAL_CATEGORIES, User
} from './types';
import { storageService } from './services/storage';
import { cloudService } from './services/cloud';
import { fileSystemService } from './services/fileSystem';
import { INITIAL_PROJECTS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import History from './components/History';
import Projects from './components/Projects';
import Planning from './components/Planning';
import Installments from './components/Installments';
import Settings from './components/Settings';
import CalendarView from './components/CalendarView';
import NotificationCenter from './components/NotificationCenter';
import QuickAddModal from './components/QuickAddModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [fileHandle, setFileHandle] = useState<any>(null);
  
  // Usando o ID fornecido pelo usuário como padrão se não houver um no localStorage
  const DEFAULT_CLIENT_ID = '848021684182-5oh0rjprrvj1cvjk19npsa9nicd31vmv.apps.googleusercontent.com';
  const [googleClientId, setGoogleClientId] = useState<string>(localStorage.getItem('ledger_google_client_id') || DEFAULT_CLIENT_ID);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [installments, setInstallments] = useState<InstallmentPlan[]>([]);
  const [projects, setProjects] = useState<LifeProject[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Inicialização de Dados Locais e Cloud
  useEffect(() => {
    // Carregar dados locais imediatamente
    setTransactions(storageService.getTransactions());
    setInstallments(storageService.getInstallments());
    setProjects(storageService.getProjects().length > 0 ? storageService.getProjects() : INITIAL_PROJECTS);
    setReminders(storageService.getReminders());
    setCategories(storageService.getCategories());

    // Inicializar Google Auth com o ID configurado
    if (googleClientId) {
      // Pequeno timeout para garantir que os scripts no index.html carregaram
      const timer = setTimeout(() => {
        cloudService.init(googleClientId, (loggedUser) => {
          if (loggedUser) {
            setUser(loggedUser);
            handleCloudSync(loggedUser);
          }
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [googleClientId]);

  // Salvamento Automático Triple-Check (Local, Cloud, FileSystem)
  useEffect(() => {
    const data = { transactions, installments, projects, categories, reminders };
    
    // Sempre salvar localmente para segurança imediata
    storageService.saveTransactions(transactions);
    storageService.saveInstallments(installments);
    storageService.saveProjects(projects);
    storageService.saveReminders(reminders);
    storageService.saveCategories(categories);

    // Sincronia externa com debounce de 3 segundos
    const timer = setTimeout(async () => {
      if (!user && !fileHandle) return;

      setSyncStatus('syncing');
      let success = true;

      if (user) {
        const cloudOk = await cloudService.saveToCloud(user, data);
        if (!cloudOk) success = false;
      }

      if (fileHandle) {
        const fileOk = await fileSystemService.saveToFile(fileHandle, data);
        if (!fileOk) success = false;
      }

      setSyncStatus(success ? 'success' : 'error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [transactions, installments, projects, categories, reminders, user, fileHandle]);

  const handleCloudSync = async (currentUser: User) => {
    const cloudData = await cloudService.loadFromCloud(currentUser);
    if (cloudData) {
      const shouldRestore = window.confirm(
        `Saudações, ${currentUser.name}! Encontramos um tomo guardado no seu Google Drive. Deseja restaurar seus registros financeiros deste backup agora?`
      );
      if (shouldRestore) {
        setTransactions(cloudData.transactions || []);
        setInstallments(cloudData.installments || []);
        setProjects(cloudData.projects || INITIAL_PROJECTS);
        setCategories(cloudData.categories || INITIAL_CATEGORIES);
        setReminders(cloudData.reminders || []);
        setSyncStatus('success');
      }
    }
  };

  const handleUpdateClientId = (id: string) => {
    localStorage.setItem('ledger_google_client_id', id);
    setGoogleClientId(id);
    // Força recarregamento para aplicar novas credenciais do Google
    window.location.reload();
  };

  const handleLinkFile = async () => {
    const handle = await fileSystemService.linkLocalFile();
    if (handle) setFileHandle(handle);
  };

  const handleLogin = () => cloudService.login();
  const handleLogout = () => {
    if (window.confirm("Deseja interromper a sincronia com a nuvem? Seus dados locais permanecerão intactos.")) {
      cloudService.logout();
      setUser(null);
    }
  };

  const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleAddReminder = (r: any) => {
    setReminders(prev => [...prev, { ...r, id: Math.random().toString(36).substr(2, 9), completed: false }]);
  };

  const handleUpdateTransaction = (t: Transaction) => {
    setTransactions(prev => prev.map(i => i.id === t.id ? t : i));
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Excluir este registro dos anais permanentemente?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onExport={() => {}} 
      onQuickAdd={() => setIsQuickAddOpen(true)}
      unreadNotifications={notifications.filter(n => !n.read).length}
      syncStatus={syncStatus}
      user={user}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && (
        <>
          {!user && !fileHandle && (
            <div className="mb-8 p-6 border-2 border-accent/20 rounded-sm bg-accent/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
               <div className="flex items-center gap-4">
                 <CloudSync className="w-8 h-8 text-accent" />
                 <div>
                   <h4 className="script-font text-3xl text-ink">Proteja seu Tomo Sagrado</h4>
                   <p className="text-[10px] uppercase font-black tracking-widest text-ink/40">Sincronize com Google Drive ou vincule uma pasta local para segurança total.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <button onClick={handleLinkFile} className="bg-white border border-ink text-ink px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-ink hover:text-white transition-all">
                   <HardDrive className="w-4 h-4" /> Vincular Pasta
                 </button>
                 <button onClick={handleLogin} className="bg-ink text-sepia-base px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                   <Landmark className="w-4 h-4" /> Google Cloud
                 </button>
               </div>
            </div>
          )}
          <TransactionForm 
            onAdd={handleAddTransaction} 
            onUpdate={handleUpdateTransaction}
            onAddReminder={handleAddReminder}
            categories={categories}
          />
          <Dashboard 
            transactions={transactions} 
            installments={installments} 
            reminders={reminders}
            onToggleReminder={(id) => setReminders(prev => prev.map(r => r.id === id ? {...r, completed: !r.completed} : r))}
            onDeleteReminder={(id) => setReminders(prev => prev.filter(r => r.id !== id))}
          />
        </>
      )}

      {activeTab === 'history' && (
        <History 
          transactions={transactions} 
          onDelete={handleDeleteTransaction} 
          onEdit={(t) => {
            setActiveTab('dashboard');
            // A edição será tratada pelo TransactionForm via state no App (opcional implementar via prop de edição)
          }} 
        />
      )}
      
      {activeTab === 'projects' && (
        <Projects 
          projects={projects} 
          transactions={transactions} 
          onAddProject={(p) => setProjects(prev => [...prev, {...p, id: Math.random().toString(36).substr(2, 9)}])} 
          onUpdateProject={(p) => setProjects(prev => prev.map(i => i.id === p.id ? p : i))} 
          onDeleteProject={(id) => setProjects(prev => prev.filter(p => p.id !== id))} 
        />
      )}
      
      {activeTab === 'installments' && (
        <Installments 
          plans={installments} 
          onAddPlan={(p) => {
             // Lógica simplificada de adição de parcelas
             const monthly = p.totalAmount / p.totalInstallments;
             const insts = Array.from({length: p.totalInstallments}, (_, i) => ({
                number: i + 1,
                dueDate: new Date(new Date(p.startDate).setMonth(new Date(p.startDate).getMonth() + i)).toISOString(),
                amount: monthly,
                isPaid: false
             }));
             setInstallments(prev => [...prev, {...p, id: Math.random().toString(36).substr(2, 9), installments: insts, currentInstallment: 1}]);
          }} 
          onTogglePaid={(pid, n) => setInstallments(prev => prev.map(plan => plan.id === pid ? {...plan, installments: plan.installments.map(i => i.number === n ? {...i, isPaid: !i.isPaid} : i)} : plan))} 
          onDeletePlan={(id) => setInstallments(prev => prev.filter(p => p.id !== id))} 
        />
      )}

      {activeTab === 'settings' && (
        <Settings 
          config={{ sheetsUrl: '', autoSync: true }} 
          onUpdateConfig={() => {}} 
          onManualSync={() => user && handleCloudSync(user)} 
          onClearData={() => { if(window.confirm("Esta ação incinerará todos os seus registros locais!")) { localStorage.clear(); window.location.reload(); } }}
          categories={categories}
          onAddCategory={(c) => setCategories(prev => [...prev, c])}
          onDeleteCategory={(c) => setCategories(prev => prev.filter(i => i !== c))}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          googleClientId={googleClientId}
          onUpdateClientId={handleUpdateClientId}
        />
      )}

      {activeTab === 'notifications' && (
        <NotificationCenter 
          notifications={notifications} 
          reminders={reminders} 
          onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n))} 
          onClearAll={() => setNotifications([])} 
          onDeleteReminder={(id) => setReminders(prev => prev.filter(r => r.id !== id))} 
          onCompleteReminder={(id) => setReminders(prev => prev.map(r => r.id === id ? {...r, completed: !r.completed} : r))} 
          onNavigate={setActiveTab} 
        />
      )}

      <QuickAddModal 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
        type={TransactionType.EXPENSE}
        onAdd={handleAddTransaction}
        onAddReminder={handleAddReminder}
        categories={categories}
      />
    </Layout>
  );
};

export default App;
