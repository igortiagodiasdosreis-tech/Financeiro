
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowUpCircle, ArrowDownCircle, CreditCard, Bell, Sparkles, PenTool } from 'lucide-react';
import { Transaction, InstallmentPlan, Reminder, TransactionType } from '../types';
import { formatCurrency, getMonthName, isOccurrenceOnDay } from '../utils';

interface CalendarViewProps {
  transactions: Transaction[];
  installments: InstallmentPlan[];
  reminders: Reminder[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ transactions, installments, reminders }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDayOfMonth; i++) arr.push(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);
    return arr;
  }, [daysInMonth, firstDayOfMonth]);

  const itemsByDay = useMemo(() => {
    const map: Record<number, any[]> = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const targetDate = new Date(year, month, day);
      if (!map[day]) map[day] = [];

      transactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getDate() === day && d.getMonth() === month && d.getFullYear() === year) {
          map[day].push({ ...t, itemType: 'transaction' });
        }
      });

      installments.forEach(plan => {
        plan.installments.forEach(inst => {
          const d = new Date(inst.dueDate);
          if (d.getDate() === day && d.getMonth() === month && d.getFullYear() === year) {
            map[day].push({ ...inst, description: plan.description, itemType: 'installment' });
          }
        });
      });

      reminders.forEach(r => {
        if (isOccurrenceOnDay(r.dueDate, r.frequency, targetDate)) {
          map[day].push({ ...r, itemType: 'reminder' });
        }
      });
    }

    return map;
  }, [transactions, installments, reminders, month, year, daysInMonth]);

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const selectedDayItems = selectedDay ? (itemsByDay[selectedDay] || []) : [];

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-ink/10 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-ink text-sepia-base rounded-sm flex items-center justify-center shadow-xl border border-accent/40">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="script-font text-6xl text-ink leading-tight">Calendário das Eras</h2>
            <p className="text-ink font-black italic text-sm mt-1 uppercase tracking-[0.3em] opacity-60">A Marcha do Tempo sobre o Tesouro</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-sepia-dark p-3 rounded shadow-inner border border-ink/20">
          <button onClick={prevMonth} className="p-2 text-ink hover:text-accent transition-colors"><ChevronLeft className="w-6 h-6" /></button>
          <div className="px-6 text-center min-w-[160px]">
            <span className="block font-black text-ink text-xl uppercase tracking-[0.2em]">{getMonthName(month)}</span>
            <span className="text-[10px] text-ink font-black uppercase tracking-widest opacity-60">Anno Domini {year}</span>
          </div>
          <button onClick={nextMonth} className="p-2 text-ink hover:text-accent transition-colors"><ChevronRight className="w-6 h-6" /></button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 p-10 border-2 border-ink/20 rounded-sm bg-sepia-light/50 shadow-2xl">
          <div className="grid grid-cols-7 mb-8 text-center">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <span key={d} className="text-[12px] font-black text-ink uppercase tracking-[0.5em]">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-ink/20 border border-ink/20 shadow-inner">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="aspect-square bg-transparent" />;
              
              const dayItems = itemsByDay[day] || [];
              const hasItems = dayItems.length > 0;
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square relative flex flex-col items-center justify-center transition-all bg-sepia-base group ${
                    selectedDay === day 
                      ? 'ring-4 ring-inset ring-ink z-10' 
                      : isToday 
                        ? 'bg-ink text-sepia-base' 
                        : 'hover:bg-sepia-dark'
                  }`}
                >
                  <span className={`text-xl font-black mono-font ${selectedDay === day ? 'text-ink scale-125' : isToday ? 'text-sepia-base' : 'text-ink'}`}>{day}</span>
                  {hasItems && (
                    <div className="absolute bottom-3 flex gap-1.5">
                      {dayItems.slice(0, 3).map((_, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full ${isToday ? 'bg-sepia-base' : 'bg-ink'}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="p-10 border-2 border-ink/20 rounded-sm min-h-[500px] bg-sepia-light/30 shadow-lg">
            <h3 className="script-font text-5xl text-ink mb-10 border-b-2 border-ink/20 pb-4 flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-accent" />
              Dia {selectedDay}
            </h3>
            
            <div className="space-y-8">
              {selectedDayItems.length > 0 ? selectedDayItems.map((item, idx) => (
                <div key={idx} className="pb-6 border-b border-ink/10 group last:border-b-0">
                  <div className="flex items-start gap-5">
                    <div className={`p-3 rounded-sm border-2 ${item.itemType === 'transaction' ? 'border-ink text-ink bg-ink/5' : 'border-ink/40 text-ink opacity-60'}`}>
                      {item.itemType === 'transaction' 
                        ? (item.type === TransactionType.INCOME ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />) 
                        : (item.itemType === 'installment' ? <CreditCard className="w-6 h-6" /> : <Bell className="w-6 h-6" />)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-ink italic leading-tight">{item.description || item.title}</p>
                      <p className="text-[11px] uppercase font-black tracking-widest text-ink mt-2 opacity-50">
                        {item.itemType === 'transaction' ? 'Lançamento' : (item.itemType === 'installment' ? 'Parcelamento' : 'Lembrete')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="text-xl font-black mono-font tabular-nums text-ink">{formatCurrency(item.amount)}</span>
                  </div>
                </div>
              )) : (
                <div className="py-32 text-center">
                  <PenTool className="w-16 h-16 mx-auto mb-8 opacity-10 text-ink" />
                  <p className="italic text-ink font-bold serif-font text-2xl opacity-40">Folha em Branco.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
