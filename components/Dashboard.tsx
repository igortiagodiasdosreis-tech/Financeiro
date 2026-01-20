
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Wallet, AlarmClock, CheckCircle2, Trash2, Calendar, Sparkles, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import { Transaction, TransactionType, Category, InstallmentPlan, Reminder } from '../types';
import { formatCurrency, getMonthName } from '../utils';

interface DashboardProps {
  transactions: Transaction[];
  installments?: InstallmentPlan[];
  reminders?: Reminder[];
  onToggleReminder?: (id: string) => void;
  onDeleteReminder?: (id: string) => void;
}

const COLORS = ['#1a1a1a', '#4a3728', '#8b5a2b', '#2c1e14', '#5d4037', '#795548', '#a1887f'];

const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  installments = [], 
  reminders = [], 
  onToggleReminder, 
  onDeleteReminder 
}) => {
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const stats = useMemo(() => {
    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    
    const normalExpenses = monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    const currentMonthInstallments = installments.flatMap(plan => 
      plan.installments.filter(inst => {
        const d = new Date(inst.dueDate);
        return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
      })
    ).reduce((acc, inst) => acc + inst.amount, 0);

    const totalExpenses = normalExpenses + currentMonthInstallments;

    return {
      income,
      expenses: totalExpenses,
      balance: income - totalExpenses,
      installmentCommitted: currentMonthInstallments
    };
  }, [transactions, installments, viewMonth, viewYear]);

  const categoryData = useMemo(() => {
    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
    });

    const categories = monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    if (stats.installmentCommitted > 0) {
      categories['Crédito'] = (categories['Crédito'] || 0) + stats.installmentCommitted;
    }

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions, stats.installmentCommitted, viewMonth, viewYear]);

  const periodReminders = useMemo(() => {
    return reminders
      .filter(r => {
        const d = new Date(r.dueDate);
        return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [reminders, viewMonth, viewYear]);

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-ink/10 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-ink text-sepia-base rounded-sm flex items-center justify-center shadow-xl border border-accent/40">
            <PenTool className="w-8 h-8" />
          </div>
          <div>
            <h2 className="script-font text-6xl text-ink leading-tight">A Crônica Mensal</h2>
            <p className="text-ink/50 italic text-sm mt-1 uppercase tracking-[0.3em] font-black">Escrituração de Ativos e Obrigações</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-sepia-dark/40 p-3 rounded shadow-inner border border-ink/10">
          <button onClick={handlePrevMonth} className="p-2 hover:text-accent transition-colors"><ChevronLeft className="w-6 h-6" /></button>
          <div className="px-6 text-center min-w-[160px]">
            <span className="block font-black text-ink text-xl uppercase tracking-[0.2em]">{getMonthName(viewMonth)}</span>
            <span className="text-[10px] opacity-40 font-black uppercase tracking-widest">Anno Domini {viewYear}</span>
          </div>
          <button onClick={handleNextMonth} className="p-2 hover:text-accent transition-colors"><ChevronRight className="w-6 h-6" /></button>
        </div>
      </header>

      {/* Grid de Balanço com Estilo de Livro de Contas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-ink/10 rounded overflow-hidden shadow-2xl">
        <div className="bg-transparent p-10 text-center border-b md:border-b-0 md:border-r border-ink/10">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">Aportes (Créditos)</p>
          <p className="text-4xl font-black text-ink mono-font tabular-nums tracking-tighter">{formatCurrency(stats.income)}</p>
        </div>
        <div className="bg-transparent p-10 text-center border-b md:border-b-0 md:border-r border-ink/10">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">Saídas (Débitos)</p>
          <p className="text-4xl font-black text-ink mono-font tabular-nums tracking-tighter">{formatCurrency(stats.expenses)}</p>
        </div>
        <div className="bg-transparent p-10 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 mb-4">Saldo Remanescente</p>
          <p className={`text-4xl font-black mono-font tabular-nums tracking-tighter ${stats.balance >= 0 ? 'text-ink' : 'text-red-900'}`}>
            {formatCurrency(stats.balance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] border-b-2 border-ink/10 pb-3 flex items-center justify-between">
              <span>Sectores de Investimento</span>
              <Sparkles className="w-4 h-4 opacity-20" />
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={8} 
                    dataKey="value" 
                    stroke="#e8dcc4"
                    strokeWidth={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#e8dcc4', 
                      border: '2px solid #1a1a1a', 
                      color: '#1a1a1a', 
                      fontFamily: 'EB Garamond',
                      fontSize: '14px', 
                      borderRadius: '0',
                      boxShadow: '10px 10px 0px rgba(0,0,0,0.1)'
                    }} 
                    formatter={(value: number) => formatCurrency(value)} 
                  />
                  <Legend iconType="square" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] border-b-2 border-ink/10 pb-3 flex items-center justify-between">
              <span>Próximos Compromissos</span>
              <AlarmClock className="w-4 h-4 opacity-20" />
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-ledger-scroll">
              {periodReminders.length > 0 ? periodReminders.map(r => (
                <div key={r.id} className="flex items-center justify-between border-b border-ink/5 pb-4 group">
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => onToggleReminder?.(r.id)}
                        className={`w-5 h-5 border-2 border-ink/20 flex items-center justify-center transition-all ${r.completed ? 'bg-ink text-sepia-base' : 'hover:border-ink'}`}
                     >
                       {r.completed && <CheckCircle2 className="w-3 h-3" />}
                     </button>
                     <div className="flex flex-col">
                        <span className={`text-base font-bold italic tracking-wide transition-all ${r.completed ? 'line-through opacity-30' : 'text-ink'}`}>{r.title}</span>
                        <span className="text-[10px] uppercase font-black opacity-40 tracking-widest">{new Date(r.dueDate).toLocaleDateString('pt-BR')}</span>
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black mono-font tabular-nums">{formatCurrency(r.amount || 0)}</span>
                    <button onClick={() => onDeleteReminder?.(r.id)} className="text-[9px] uppercase font-black text-red-900 opacity-0 group-hover:opacity-100 transition-opacity mt-1">Excluir</button>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center italic opacity-30 border-2 border-dashed border-ink/10 rounded">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="text-sm">Nenhum evento profetizado nestes anais.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
