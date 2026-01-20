
import React, { useState } from 'react';
import { 
  AlarmClock, Plus, Calendar, CheckCircle2, 
  Circle, Trash2, AlertTriangle, RefreshCcw 
} from 'lucide-react';
import { Reminder, ReminderFrequency } from '../types';
import { formatCurrency } from '../utils';

interface RemindersProps {
  reminders: Reminder[];
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'completed'>) => void;
  onDeleteReminder: (id: string) => void;
  onToggleComplete: (id: string) => void;
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

const Reminders: React.FC<RemindersProps> = ({ 
  reminders, onAddReminder, onDeleteReminder, onToggleComplete 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState<ReminderFrequency>('once');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReminder({
      title,
      amount: amount ? parseFloat(amount) : undefined,
      dueDate,
      frequency
    });
    setIsAdding(false);
    setTitle('');
    setAmount('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setFrequency('once');
  };

  const sortedReminders = [...reminders].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const pendingTotal = reminders
    .filter(r => !r.completed)
    .reduce((acc, r) => acc + (r.amount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Lembretes de Contas</h2>
          <p className="text-slate-500">Gerencie pagamentos únicos ou recorrentes com precisão.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-teal-100"
        >
          <Plus className="w-5 h-5" /> Adicionar Conta
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Statistics & Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pendente no Mês</h3>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(pendingTotal)}</p>
              <p className="text-sm text-slate-500 font-medium">Contas em aberto</p>
            </div>
          </div>

          {isAdding && (
            <div className="bg-white p-6 rounded-3xl border-2 border-primary shadow-xl animate-in zoom-in-95 duration-200">
              <h3 className="font-bold text-slate-800 mb-4">Nova Conta / Recorrência</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Nome do Compromisso</label>
                  <input
                    autoFocus
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Ex: Assinatura Netflix, IPTU..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Valor Estimado</label>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Vencimento</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Frequência da Repetição</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as ReminderFrequency)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium text-slate-700"
                  >
                    {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-50">Agendar</button>
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">Cancelar</button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                <AlarmClock className="w-5 h-5 text-primary" />
                Seu Cronograma
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {sortedReminders.length > 0 ? sortedReminders.map(reminder => {
                const isOverdue = !reminder.completed && new Date(reminder.dueDate) < new Date(new Date().setHours(0,0,0,0));
                return (
                  <div key={reminder.id} className={`p-4 flex items-center justify-between group transition-all ${reminder.completed ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'}`}>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => onToggleComplete(reminder.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          reminder.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-primary'
                        }`}
                      >
                        {reminder.completed && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-bold text-sm ${reminder.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            {reminder.title}
                          </h4>
                          {reminder.frequency !== 'once' && (
                            <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1 uppercase">
                              <RefreshCcw className="w-2.5 h-2.5" /> {FREQUENCY_LABELS[reminder.frequency]}
                            </span>
                          )}
                          {isOverdue && (
                            <span className="text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> VENCIDO
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] text-slate-500 font-medium italic">
                            Próximo: {new Date(reminder.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {reminder.amount && (
                        <div className="text-right">
                          <p className={`font-bold text-sm ${reminder.completed ? 'text-slate-400' : isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                            {formatCurrency(reminder.amount)}
                          </p>
                        </div>
                      )}
                      <button 
                        onClick={() => onDeleteReminder(reminder.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 transition-opacity opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-16 text-center text-slate-400">
                  <AlarmClock className="w-16 h-16 mx-auto mb-4 opacity-10" />
                  <p className="font-bold text-slate-500">Tudo em dia!</p>
                  <p className="text-xs max-w-[200px] mx-auto mt-1">Lançamentos agendados no dashboard aparecem aqui automaticamente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
