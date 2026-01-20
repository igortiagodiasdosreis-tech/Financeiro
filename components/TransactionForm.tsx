
import React, { useState, useEffect } from 'react';
import { PenTool, Save, X, Calendar, Landmark, Tag, Sparkles, RefreshCcw } from 'lucide-react';
import { TransactionType, Category, Emotion, Transaction, ReminderFrequency } from '../types';
import { getTodayStr } from '../utils';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdate?: (transaction: Transaction) => void;
  onAddReminder: (reminder: any) => void;
  projects?: { id: string, name: string }[];
  editingTransaction?: Transaction | null;
  onCancelEdit?: () => void;
  categories: Category[];
}

const FREQUENCY_LABELS: Record<ReminderFrequency, string> = {
  once: 'Único',
  daily: 'Diário',
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal',
  bimonthly: 'Bimestral',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual'
};

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onAdd, onUpdate, onAddReminder, projects = [], editingTransaction, onCancelEdit, categories 
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category>(categories[0] || 'Outros');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<ReminderFrequency>('monthly');

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const data = {
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date).toISOString(),
    };

    if (editingTransaction && onUpdate) {
      onUpdate({ ...editingTransaction, ...data });
    } else {
      onAdd(data);
      if (isRecurring) {
        onAddReminder({
          title: description,
          amount: parseFloat(amount),
          dueDate: date,
          frequency,
        });
      }
    }
    reset();
  };

  const reset = () => {
    setDescription('');
    setAmount('');
    setDate(getTodayStr());
    setIsRecurring(false);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="relative mb-20 p-10 border-2 border-ink/10 rounded-sm bg-white/5 shadow-inner">
      <div className="absolute top-0 right-0 -mt-10 -mr-6 transform rotate-12 opacity-10 pointer-events-none">
        <PenTool className="w-32 h-32" />
      </div>
      
      <div className="flex items-center gap-4 mb-10 border-b border-ink/10 pb-4">
        <Sparkles className="w-6 h-6 opacity-30 text-accent" />
        <h3 className="script-font text-5xl text-ink">Nova Escrituração</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
             <div className="flex flex-col">
               <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Histórico do Lançamento</label>
               <input 
                 className="ink-input italic font-bold text-lg"
                 value={description}
                 onChange={e => setDescription(e.target.value)}
                 placeholder="O que foi adquirido nestas terras?"
                 required
               />
             </div>
             
             <div className="flex flex-col">
               <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Moeda Corrente (BRL)</label>
               <div className="relative">
                 <span className="absolute left-0 bottom-3 text-xs opacity-40 font-black">R$</span>
                 <input 
                   type="number"
                   step="0.01"
                   className="ink-input pl-6 w-full mono-font font-black"
                   value={amount}
                   onChange={e => setAmount(e.target.value)}
                   placeholder="0.00"
                   required
                 />
               </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="flex flex-col">
               <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Data da Manifestação</label>
               <div className="relative">
                 <Calendar className="absolute right-0 bottom-3 w-4 h-4 opacity-20" />
                 <input 
                   type="date"
                   className="ink-input w-full [color-scheme:light] opacity-70"
                   value={date}
                   onChange={e => setDate(e.target.value)}
                   required
                 />
               </div>
             </div>

             <div className="space-y-4">
               <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Natureza do Fluxo</label>
               <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setType(TransactionType.EXPENSE)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.4em] border transition-all ${type === TransactionType.EXPENSE ? 'bg-ink text-sepia-base shadow-xl' : 'border-ink/20 opacity-30 hover:opacity-50'}`}
                  >
                    Débito
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setType(TransactionType.INCOME)}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.4em] border transition-all ${type === TransactionType.INCOME ? 'bg-ink text-sepia-base shadow-xl' : 'border-ink/20 opacity-30 hover:opacity-50'}`}
                  >
                    Crédito
                  </button>
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-ink/5">
           <div className="flex flex-wrap items-center gap-8">
             <div className="flex items-center gap-2 opacity-60">
               <Tag className="w-4 h-4" />
               <select 
                value={category} 
                onChange={e => setCategory(e.target.value as Category)}
                className="bg-transparent text-xs font-black uppercase tracking-widest outline-none border-b border-ink/10"
               >
                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>

             {!editingTransaction && (
               <div className="flex items-center gap-4">
                 <button 
                  type="button"
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 border transition-all ${isRecurring ? 'bg-accent/20 border-accent text-accent' : 'border-ink/10 opacity-40'}`}
                 >
                   <RefreshCcw className={`w-3 h-3 ${isRecurring ? 'animate-spin-slow' : ''}`} /> Recorrência
                 </button>
                 {isRecurring && (
                   <select 
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as ReminderFrequency)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none border-b border-ink/10"
                   >
                     {Object.entries(FREQUENCY_LABELS).map(([val, label]) => (
                       <option key={val} value={val}>{label}</option>
                     ))}
                   </select>
                 )}
               </div>
             )}
           </div>

           <div className="flex gap-4">
              {editingTransaction && (
                <button type="button" onClick={reset} className="px-8 py-3 text-[10px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 transition-all">Descartar</button>
              )}
              <button type="submit" className="bg-ink text-sepia-base px-12 py-4 rounded-sm text-[11px] uppercase font-black tracking-[0.4em] hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                 <Save className="w-4 h-4" />
                 Confirmar Assinatura
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
