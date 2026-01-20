
import { Transaction, InstallmentPlan, LifeProject, Notification, Reminder, BankConnection, Category, INITIAL_CATEGORIES } from '../types';

const KEYS = {
  TRANSACTIONS: 'emotional_fin_transactions',
  INSTALLMENTS: 'emotional_fin_installments',
  PROJECTS: 'emotional_fin_projects',
  NOTIFICATIONS: 'emotional_fin_notifications',
  REMINDERS: 'emotional_fin_reminders',
  CONNECTIONS: 'emotional_fin_connections',
  CATEGORIES: 'emotional_fin_categories',
};

export const storageService = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  getInstallments: (): InstallmentPlan[] => {
    const data = localStorage.getItem(KEYS.INSTALLMENTS);
    return data ? JSON.parse(data) : [];
  },
  saveInstallments: (installments: InstallmentPlan[]) => {
    localStorage.setItem(KEYS.INSTALLMENTS, JSON.stringify(installments));
  },
  getProjects: (): LifeProject[] => {
    const data = localStorage.getItem(KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },
  saveProjects: (projects: LifeProject[]) => {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  },
  getNotifications: (): Notification[] => {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveNotifications: (notifications: Notification[]) => {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
  getReminders: (): Reminder[] => {
    const data = localStorage.getItem(KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  },
  saveReminders: (reminders: Reminder[]) => {
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  },
  getBankConnections: (): BankConnection[] => {
    const data = localStorage.getItem(KEYS.CONNECTIONS);
    return data ? JSON.parse(data) : [];
  },
  saveBankConnections: (connections: BankConnection[]) => {
    localStorage.setItem(KEYS.CONNECTIONS, JSON.stringify(connections));
  },
  getCategories: (): Category[] => {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  }
};
