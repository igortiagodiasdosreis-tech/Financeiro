
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Transaction, TransactionType, Category, Emotion, 
  InstallmentPlan, LifeProject, Notification, Reminder, 
  BankConnection, SyncConfig, INITIAL_CATEGORIES 
} from './types';
import { storageService } from './services/storage';
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
import BankIntegration from './components/BankIntegration';
import QuickAddModal from './components/QuickAddModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [installments, setInstallments] = useState<InstallmentPlan[]>([]);
  const [projects, setProjects] = useState<LifeProject[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [syncConfig, setSyncConfig] = useState<SyncConfig>({
    sheetsUrl: '',
    autoSync: false,
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    try {
      const storedTransactions = storageService.getTransactions();
      setTransactions(storedTransactions);

      const storedInstallments = storageService.getInstallments();
      setInstallments(storedInstallments);
      
      const storedProjects = storageService.getProjects();
      setProjects(storedProjects.length > 0 ? storedProjects : INITIAL_PROJECTS);
      
      const storedNotifications = storageService.getNotifications();
      setNotifications(storedNotifications);

      const storedReminders = storageService.getReminders();
      setReminders(storedReminders);

      const storedConnections = storageService.getBankConnections();
      setBankConnections(storedConnections);

      const storedCategories = storageService.getCategories();
      setCategories(storedCategories);
    } catch (error) {
      console.error("Failed to load data from storage:", error);
    }
  }, []);

  useEffect(() => { storageService.saveTransactions(transactions); }, [transactions]);
  useEffect(() => { storageService.saveInstallments(installments); }, [installments]);
  useEffect(() => { storageService.saveProjects(projects); }, [projects]);
  useEffect(() => { storageService.saveNotifications(notifications); }, [notifications]);
  useEffect(() => { storageService.saveReminders(reminders); }, [reminders]);
  useEffect(() => { storageService.saveBankConnections(bankConnections); }, [bankConnections]);
  useEffect(() => { storageService.saveCategories(categories); }, [categories]);

  const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleUpdateTransaction = (t: Transaction) => {
    setTransactions(prev => prev.map(item => item.id === t.id ? t : item));
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Deseja excluir este registro permanentemente?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddCategory = (newCat: string) => {
    if (newCat && !categories.includes(newCat)) {
      setCategories(prev => [...prev, newCat]);
    }
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (window.confirm(`Deseja remover a categoria "${catToDelete}"? Registros existentes manterão o nome mas não terão ícone padrão.`)) {
      setCategories(prev => prev.filter(c => c !== catToDelete));
    }
  };

  const handleAddReminder = (r: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminder: Reminder = {
      ...r,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
    };
    setReminders(prev => [newReminder, ...prev]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleAddProject = (p: Omit<LifeProject, 'id'>) => {
    const newProject: LifeProject = {
      ...p,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const handleUpdateProject = (p: LifeProject) => {
    setProjects(prev => prev.map(item => item.id === p.id ? p : item));
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Deseja remover este sonho?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddInstallmentPlan = (plan: Omit<InstallmentPlan, 'id' | 'installments' | 'currentInstallment'>) => {
    const installmentsArr = [];
    const monthlyAmount = plan.totalAmount / plan.totalInstallments;
    const start = new Date(plan.startDate);

    for (let i = 1; i <= plan.totalInstallments; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(start.getMonth() + i - 1);
      installmentsArr.push({
        number: i,
        dueDate: dueDate.toISOString(),
        amount: monthlyAmount,
        isPaid: false
      });
    }

    const newPlan: InstallmentPlan = {
      ...plan,
      id: Math.random().toString(36).substr(2, 9),
      currentInstallment: 1,
      installments: installmentsArr
    };
    setInstallments(prev => [...prev, newPlan]);
  };

  const handleUpdateInstallmentPlan = (plan: InstallmentPlan) => {
    setInstallments(prev => prev.map(p => p.id === plan.id ? plan : p));
  };

  const handleToggleInstallmentPaid = (planId: string, installmentNumber: number) => {
    setInstallments(prev => prev.map(plan => {
      if (plan.id === planId) {
        const newInstallments = plan.installments.map(inst => 
          inst.number === installmentNumber ? { ...inst, isPaid: !inst.isPaid } : inst
        );
        return { ...plan, installments: newInstallments };
      }
      return plan;
    }));
  };

  const handleDeleteInstallmentPlan = (id: string) => {
    if (window.confirm('Remover este plano de parcelamento?')) {
      setInstallments(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleClearData = () => {
    if (window.confirm('CUIDADO: Isso apagará TODOS os seus dados locais permanentemente. Continuar?')) {
      setTransactions([]);
      setInstallments([]);
      setProjects(INITIAL_PROJECTS);
      setNotifications([]);
      setReminders([]);
      setBankConnections([]);
      setCategories(INITIAL_CATEGORIES);
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleConnectBank = (bankName: string) => {
    const newConnection: BankConnection = {
      id: Math.random().toString(36).substr(2, 9),
      bankName,
      status: 'connected',
      lastSync: new Date().toISOString()
    };
    setBankConnections(prev => [...prev, newConnection]);
  };

  const handleSyncBank = async (id: string) => {
    setSyncStatus('syncing');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      setBankConnections(prev => prev.map(c => c.id === id ? { ...c, lastSync: new Date().toISOString(), status: 'connected' } : c));
      setSyncStatus('success');
    } catch (error) {
      setSyncStatus('error');
    } finally {
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const unreadNotificationsCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <TransactionForm 
              onAdd={handleAddTransaction} 
              onUpdate={handleUpdateTransaction}
              onAddReminder={handleAddReminder}
              projects={projects}
              editingTransaction={editingTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
              categories={categories}
            />
            <Dashboard 
              transactions={transactions} 
              installments={installments}
              reminders={reminders}
              onToggleReminder={handleToggleReminder}
              onDeleteReminder={handleDeleteReminder}
            />
          </>
        );
      case 'history':
        return (
          <History 
            transactions={transactions} 
            onDelete={handleDeleteTransaction} 
            onEdit={(t) => { 
              setEditingTransaction(t); 
              setActiveTab('dashboard'); 
            }} 
          />
        );
      case 'calendar':
        return <CalendarView transactions={transactions} installments={installments} reminders={reminders} />;
      case 'planning':
        return <Planning transactions={transactions} installments={installments} reminders={reminders} />;
      case 'projects':
        return (
          <Projects 
            projects={projects} 
            transactions={transactions} 
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
        );
      case 'installments':
        return (
          <Installments 
            plans={installments} 
            onAddPlan={handleAddInstallmentPlan}
            onUpdatePlan={handleUpdateInstallmentPlan}
            onTogglePaid={handleToggleInstallmentPaid}
            onDeletePlan={handleDeleteInstallmentPlan}
          />
        );
      case 'settings':
        return (
          <Settings 
            config={syncConfig}
            onUpdateConfig={setSyncConfig}
            onManualSync={() => {}} 
            onClearData={handleClearData}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'notifications':
        return (
          <NotificationCenter 
            notifications={notifications}
            reminders={reminders}
            onMarkRead={handleMarkNotificationRead}
            onClearAll={handleClearNotifications}
            onDeleteReminder={handleDeleteReminder}
            onCompleteReminder={handleToggleReminder}
            onNavigate={setActiveTab}
          />
        );
      case 'bank':
        return (
          <BankIntegration 
            connections={bankConnections}
            onConnect={handleConnectBank}
            onSync={handleSyncBank}
            isSyncing={syncStatus === 'syncing'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onExport={() => {}} 
      onQuickAdd={() => setIsQuickAddOpen(true)}
      unreadNotifications={unreadNotificationsCount}
      syncStatus={syncStatus}
    >
      {renderContent()}
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
