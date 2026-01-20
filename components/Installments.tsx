
import React, { useState } from 'react';
import { Plus, CreditCard, Calendar, CheckCircle2, Circle, Trash2, Edit3, X, Save, Sparkles, PenTool, Check } from 'lucide-react';
import { InstallmentPlan } from '../types';
import { formatCurrency } from '../utils';

interface InstallmentsProps {
  plans: InstallmentPlan[];
  onAddPlan: (plan: Omit<InstallmentPlan, 'id' | 'installments' | 'currentInstallment'>) => void;
  onUpdatePlan?: (plan: InstallmentPlan) => void;
  onTogglePaid: (planId: string, installmentNumber: number) => void;
  onDeletePlan: (planId: string) => void;
}

const Installments: React.FC<InstallmentsProps> = ({ plans, onAddPlan, onUpdatePlan, onTogglePaid, onDeletePlan }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [count, setCount] = useState('1');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const plan = plans.find(p => p.id === editingId);
      if (plan && onUpdatePlan) {
        onUpdatePlan({
          ...plan,
          description,
          totalAmount: parseFloat(totalAmount)
        });
      }
    } else {
      onAddPlan({
        description,
        totalAmount: parseFloat(totalAmount),
        totalInstallments: parseInt(count),
        startDate
      });
    }
    
    // Animação de sucesso
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setDescription('');
    setTotalAmount('');
    setCount('1');
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  const startEdit = (plan: InstallmentPlan) => {
    setEditingId(plan.id);
    setDescription(plan.description);
    setTotalAmount(plan.totalAmount.toString());
    setStartDate(new Date(plan.startDate).toISOString().split('T')[0]);
    setIsAdding(true);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-ink/10 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-ink text-sepia-base rounded-sm flex items-center justify-center shadow-xl border border-accent/40">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h2 className="script-font text-6xl text-ink leading-tight">Dívidas e Obrigações</h2>
            <p className="text-ink/50 italic text-sm mt-1 uppercase tracking-[0.3em] font-black">O Registro de Compromissos Futuros</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-ink text-sepia-base px-10 py-4 rounded-sm hover:scale-105 transition-all shadow-2xl font-black uppercase tracking-[0.4em] text-[11px] flex items-center gap-3"
          >
            <Plus className="w-5 h-5" /> Escriturar Parcelamento
          </button>
        )}
      </header>

      {isAdding && (
        <div className="relative p-10 border-2 border-accent/20 rounded-sm bg-white/5 shadow-2xl animate-fade-in mb-12">
          <div className="flex items-center justify-between mb-10 border-b border-ink/10 pb-4">
            <div className="flex items-center gap-4">
               <PenTool className="w-6 h-6 opacity-30 text-accent" />
               <h3 className="script-font text-4xl text-ink">
                 {editingId ? 'Revisar Compromisso' : 'Novo Lançamento Parcelado'}
               </h3>
            </div>
            <button onClick={resetForm} className="text-red-900 opacity-40 hover:opacity-100 transition-all"><X /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2 flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Descrição do Item</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="ink-input italic font-bold text-lg"
                placeholder="Ex: Mobiliário de Época para a Biblioteca..."
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Montante Total (R$)</label>
              <input
                type="number"
                required
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="ink-input mono-font font-black"
              />
            </div>
            {!editingId && (
              <div className="flex flex-col">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Nº de Parcelas</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="ink-input mono-font font-black"
                />
              </div>
            )}
            <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Data da 1ª Parcela</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ink-input w-full [color-scheme:light] opacity-70"
              />
            </div>
            <div className="md:col-span-4 flex justify-end gap-6 pt-6 border-t border-ink/5">
              <button onClick={resetForm} type="button" className="px-8 py-3 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100">
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSuccess}
                className={`bg-ink text-sepia-base px-12 py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center gap-3 transition-all transform ${isSuccess ? 'scale-95 bg-emerald-900' : 'hover:scale-105'}`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" /> Escriturado!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {editingId ? 'Atualizar Registro' : 'Arquivar Parcelamento'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {plans.length > 0 ? plans.map(plan => (
          <div key={plan.id} className="relative bg-white/5 border border-ink/10 rounded-sm overflow-hidden flex flex-col group shadow-lg hover:shadow-2xl transition-all">
            <div className="p-8 border-b border-ink/10 flex items-center justify-between bg-ink/[0.03]">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-ink text-sepia-base rounded-sm shadow-xl border border-accent/20">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="script-font text-4xl text-ink leading-tight">{plan.description}</h3>
                  <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-1">
                    Acordo de {plan.totalInstallments} parcelas • {formatCurrency(plan.totalAmount / plan.totalInstallments)} mensais
                  </p>
                </div>
              </div>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(plan)} className="p-2 text-ink hover:text-accent transition-colors"><Edit3 className="w-5 h-5" /></button>
                <button onClick={() => onDeletePlan(plan.id)} className="p-2 text-red-900 opacity-60 hover:opacity-100 transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="p-8 flex-1">
              <div className="max-h-72 overflow-y-auto space-y-4 pr-4 custom-ledger-scroll">
                {plan.installments.map(inst => (
                  <div key={inst.number} className={`flex items-center justify-between p-5 border transition-all ${inst.isPaid ? 'bg-ink/[0.02] border-ink/5' : 'bg-transparent border-ink/10'}`}>
                    <div className="flex items-center gap-6">
                      <button onClick={() => onTogglePaid(plan.id, inst.number)} className="relative flex-shrink-0">
                        {inst.isPaid ? (
                          <div className="stamp-paid text-[10px] scale-90">Liquidado</div>
                        ) : (
                          <div className="w-7 h-7 border-2 border-ink/20 hover:border-ink transition-all flex items-center justify-center">
                            <Circle className="w-3 h-3 opacity-0" />
                          </div>
                        )}
                      </button>
                      <div className="flex flex-col">
                        <p className={`text-lg font-bold italic transition-all ${inst.isPaid ? 'text-ink/30 line-through' : 'text-ink'}`}>
                          Parcela {inst.number} de {plan.totalInstallments}
                        </p>
                        <p className="text-[10px] text-ink/40 font-black uppercase tracking-widest">Vencimento: {new Date(inst.dueDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <span className={`text-base font-black mono-font tabular-nums ${inst.isPaid ? 'text-ink/20' : 'text-ink'}`}>
                      {formatCurrency(inst.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-ink/10 bg-ink/[0.01]">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-ink/40 mb-4">
                <span>Progresso da Liquidação</span>
                <span className="text-ink">{((plan.installments.filter(i => i.isPaid).length / plan.totalInstallments) * 100).toFixed(0)}% Pago</span>
              </div>
              <div className="h-3 bg-ink/5 rounded-full overflow-hidden border border-ink/10 p-0.5">
                <div 
                  className="h-full bg-ink transition-all duration-1000" 
                  style={{ width: `${(plan.installments.filter(i => i.isPaid).length / plan.totalInstallments) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )) : (
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-40 bg-white/5 border-2 border-dashed border-ink/10 rounded-sm">
            <CreditCard className="w-20 h-20 mb-8 opacity-5" />
            <p className="script-font text-5xl text-ink/20">Nenhum compromisso registrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Installments;
