
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export const INITIAL_CATEGORIES = [
  'Salário',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Contas/Utilities',
  'Outros'
];

export type Category = string;

export enum Emotion {
  HAPPY = '😊 Feliz',
  IN_LOVE = '😍 Apaixonado',
  SATISFIED = '😌 Satisfeito',
  ANXIOUS = '😰 Ansioso',
  SAD = '😢 Triste',
  FRUSTRATED = '😤 Frustrado',
  TIRED = '😴 Cansado',
  NEUTRAL = '😐 Neutro'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  emotion?: Emotion;
  date: string;
  projectId?: string;
  externalId?: string;
  synced?: boolean;
}

export interface InstallmentPlan {
  id: string;
  description: string;
  totalAmount: number;
  totalInstallments: number;
  currentInstallment: number;
  startDate: string;
  installments: Installment[];
  synced?: boolean;
}

export interface Installment {
  number: number;
  dueDate: string;
  amount: number;
  isPaid: boolean;
}

export interface LifeProject {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
}

export interface BankConnection {
  id: string;
  bankName: string;
  lastSync?: string;
  status: 'connected' | 'error' | 'syncing';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  read: boolean;
  action?: {
    label: string;
    tab: string;
  };
}

export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly' | 'semiannual' | 'annual';

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  amount?: number;
  frequency: ReminderFrequency;
  completed: boolean;
}

export interface SyncConfig {
  sheetsUrl: string;
  lastSyncAt?: string;
  autoSync: boolean;
}
