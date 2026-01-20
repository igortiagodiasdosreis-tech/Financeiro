
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Save, Calendar, Tag, RefreshCcw } from 'lucide-react';
import { TransactionType, Category, Emotion, Transaction, ReminderFrequency } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onAddReminder: (reminder: any) => void;
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

const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, type, onAdd, onAddReminder, categories }) => {
  const today = new Date().toISOString().split('T')[0];
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [date, setDate] = useState(today);
  const [cat, setCat] = useState<Category>(categories[0] || 'Outros');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<ReminderFrequency>('monthly');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !val || !date) return;
    
    const selectedDate = new Date(date);
    const now = new Date();
    selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    onAdd({
      description: desc,
      amount: parseFloat(val),
      type,
      category: cat,
      emotion: type === TransactionType.EXPENSE ? Emotion.NEUTRAL : undefined,
      date: selectedDate.toISOString()
    });

    if (isRecurring) {
      onAddReminder({
        title: desc,
        amount: parseFloat(val),
        dueDate: date,
        frequency,
      });
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setDesc('');
    setVal('');
    setDate(today);
    setIsRecurring(false);
    setFrequency('monthly');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/80 backdrop-blur-sm animate-fade-in">
      <div className="book-container w-full max-w-lg p-10 border-2 border-accent/40 shadow-2xl">
        <div className="flex items-center justify-between mb-10 border-b border-ink/10 pb-4">
          <div className="flex items-center gap-4">
            {type === TransactionType.INCOME ? <TrendingUp className="w-6 h-6 text-accent" /> : <TrendingDown className="w-6 h-6 text-accent" />}
            <h3 className="script-font text-5xl text-ink">Lançamento Rápido</h3>
          </div>
          <button onClick={onClose} className="text-red-900 opacity-60 hover:opacity-100"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          <div className="flex flex-col">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Histórico</label>
            <input 
              autoFocus
              type="text" 
              value={desc} 
              onChange={e => setDesc(e.target.value)}
              className="ink-input italic font-bold text-xl"
              placeholder="Ex: Livros de Poesia..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Valor (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                value={val} 
                onChange={e => setVal(e.target.value)}
                className="ink-input mono-font font-black text-lg"
                placeholder="0,00"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Data</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="ink-input [color-scheme:light] opacity-70"
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Classificação</label>
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 opacity-40" />
                <select 
                  value={cat} 
                  onChange={e => setCat(e.target.value)}
                  className="bg-transparent text-sm font-black uppercase tracking-widest outline-none border-b border-ink/10 w-full"
                >
                  {categories.map(c => <option key={c} value={c} className="bg-sepia-base">{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button 
                type="button"
                onClick={() => setIsRecurring(!isRecurring)}
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 border transition-all ${isRecurring ? 'bg-accent/20 border-accent text-accent' : 'border-ink/10 opacity-40'}`}
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${isRecurring ? 'animate-spin-slow' : ''}`} /> Recorrência
              </button>
              
              {isRecurring && (
                <div className="flex-1 flex flex-col">
                  <select 
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as ReminderFrequency)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] outline-none border-b border-ink/20 py-1"
                  >
                    {Object.entries(FREQUENCY_LABELS).map(([val, label]) => (
                      <option key={val} value={val} className="bg-sepia-base">{label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-ink text-sepia-base py-5 rounded-sm font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform"
          >
            <Save className="w-5 h-5" /> Confirmar Assinatura
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
