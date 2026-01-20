
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, CreditCard, Clock, Bell, PenTool } from 'lucide-react';
import { Transaction, TransactionType, InstallmentPlan, Reminder } from '../types';
import { formatCurrency, getMonthName, isOccurrenceOnDay } from '../utils';

interface PlanningProps {
  transactions: Transaction[];
  installments?: InstallmentPlan[];
  reminders?: Reminder[];
}

const Planning: React.FC<PlanningProps> = ({ transactions, installments = [], reminders = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const { monthlyItems, income, expenses, balance } = useMemo(() => {
    const normalTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const monthlyInstallments = installments.flatMap(plan => 
      plan.installments
        .filter(inst => {
          const d = new Date(inst.dueDate);
          return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        })
        .map(inst => ({
          id: `${plan.id}-${inst.number}`,
          description: `${plan.description} (${inst.number}/${plan.totalInstallments})`,
          amount: inst.amount,
          date: inst.dueDate,
          type: TransactionType.EXPENSE,
          category: 'Crédito',
          isInstallment: true,
          isPaid: inst.isPaid,
          isRecurring: false
        }))
    );

    const recurringOccurrences: any[] = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    reminders.forEach(reminder => {
      for (let day = 1; day <= daysInMonth; day++) {
        const targetDate = new Date(selectedYear, selectedMonth, day);
        if (isOccurrenceOnDay(reminder.dueDate, reminder.frequency, targetDate)) {
          recurringOccurrences.push({
            id: `rem-${reminder.id}-${day}`,
            description: reminder.title,
            amount: reminder.amount || 0,
            date: targetDate.toISOString(),
            type: TransactionType.EXPENSE,
            category: 'Agendado',
            isInstallment: false,
            isPaid: false,
            isRecurring: true
          });
        }
      }
    });

    const combined = [
      ...normalTransactions.map(t => ({ ...t, isInstallment: false, isRecurring: false })),
      ...monthlyInstallments,
      ...recurringOccurrences
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const inc = normalTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
    const exp = normalTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
    const instExp = monthlyInstallments.reduce((acc, inst) => acc + inst.amount, 0);
    const recurExp = recurringOccurrences.reduce((acc, occ) => acc + occ.amount, 0);

    const totalExp = exp + instExp + recurExp;

    return {
      monthlyItems: combined,
      income: inc,
      expenses: totalExp,
      balance: inc - totalExp
    };
  }, [transactions, installments, reminders, selectedMonth, selectedYear]);

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-ink/10 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-ink text-sepia-base rounded-sm flex items-center justify-center shadow-xl border border-accent/40">
            <PenTool className="w-8 h-8" />
          </div>
          <div>
            <h2 className="script-font text-6xl text-ink leading-tight">Escrutínio de Futuros</h2>
            <p className="text-ink/50 italic text-sm mt-1 uppercase tracking-[0.3em] font-black">Projeções e Balanços Profetizados</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-sepia-dark/40 p-3 rounded shadow-inner border border-ink/10">
          <button onClick={handlePrevMonth} className="p-2 hover:text-accent transition-colors"><ChevronLeft className="w-6 h-6" /></button>
          <div className="px-6 text-center min-w-[160px]">
            <span className="block font-black text-ink text-xl uppercase tracking-[0.2em]">{getMonthName(selectedMonth)}</span>
            <span className="text-[10px] opacity-40 font-black uppercase tracking-widest">Anno Domini {selectedYear}</span>
          </div>
          <button onClick={handleNextMonth} className="p-2 hover:text-accent transition-colors"><ChevronRight className="w-6 h-6" /></button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-ink/10 rounded overflow-hidden shadow-2xl">
        <div className="bg-transparent p-10 text-center border-b md:border-b-0 md:border-r border-ink/10">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">Entradas Previstas</p>
          <p className="text-3xl font-black text-ink mono-font tabular-nums tracking-tighter">{formatCurrency(income)}</p>
        </div>
        <div className="bg-transparent p-10 text-center border-b md:border-b-0 md:border-r border-ink/10">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">Compromissos Firmados</p>
          <p className="text-3xl font-black text-ink mono-font tabular-nums tracking-tighter">{formatCurrency(expenses)}</p>
        </div>
        <div className="bg-transparent p-10 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">Saldo Remanescente</p>
          <p className={`text-3xl font-black mono-font tabular-nums tracking-tighter ${balance >= 0 ? 'text-ink' : 'text-red-900'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="border border-ink/10 rounded overflow-hidden shadow-sm">
        <div className="p-8 border-b border-ink/10 bg-ink/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-ink opacity-40" />
            <h3 className="script-font text-3xl text-ink">Folha de Projeção: {getMonthName(selectedMonth)}</h3>
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest opacity-30">Página de Planejamento</span>
        </div>
        
        <div className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40 bg-ink/[0.01]">
                <th className="px-8 py-4 border-b border-ink/5">Data</th>
                <th className="px-8 py-4 border-b border-ink/5">Histórico</th>
                <th className="px-8 py-4 border-b border-ink/5 text-right">Montante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {monthlyItems.length > 0 ? monthlyItems.map(item => (
                <tr key={item.id} className={`hover:bg-ink/[0.02] transition-colors ${item.isRecurring ? 'bg-accent/5' : ''}`}>
                  <td className="px-8 py-5 text-xs font-black mono-font opacity-40 tabular-nums">
                    {new Date(item.date).toLocaleDateString('pt-BR').split(',')[0]}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-sm border ${item.isRecurring ? 'border-accent/40 text-accent' : 'border-ink/10 text-ink opacity-40'}`}>
                        {item.isRecurring ? <Bell className="w-4 h-4" /> : (item.isInstallment ? <CreditCard className="w-4 h-4" /> : <Calendar className="w-4 h-4" />)}
                      </div>
                      <div className="flex flex-col">
                        <span className="italic font-bold text-base tracking-wide text-ink">{item.description}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] uppercase font-black opacity-30 tracking-widest">{item.category}</span>
                           {item.isRecurring && <span className="text-[8px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full uppercase font-black tracking-tighter">Recorrente</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-8 py-5 text-right font-black mono-font text-base tabular-nums ${item.type === TransactionType.INCOME ? 'text-ink' : 'text-red-900/70'}`}>
                    {item.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(item.amount)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="py-32 text-center">
                    <Clock className="w-16 h-16 mx-auto mb-6 opacity-10" />
                    <p className="italic opacity-40 font-bold serif-font text-xl">O Livro de Projeções permanece em branco para este período.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Planning;
