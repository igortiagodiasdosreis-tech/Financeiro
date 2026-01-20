
import React, { useState } from 'react';
// Added missing ScrollText to imports from lucide-react
import { Trash2, Search, Edit3, Printer, FileText, ScrollText } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface HistoryProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

const History: React.FC<HistoryProps> = ({ transactions, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions
    .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-ink/10 pb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-ink text-sepia-base rounded-sm flex items-center justify-center shadow-xl border border-accent/40">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h2 className="script-font text-6xl text-ink leading-tight">Os Anais da Fortuna</h2>
            <p className="text-ink/50 italic text-sm mt-1 uppercase tracking-[0.3em] font-black">Cronologia Imutável dos Fluxos</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" />
          <input 
            className="ink-input pl-12 pr-6 py-3 text-base italic w-full md:w-80"
            placeholder="Escavar nos registros antigos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="overflow-x-auto shadow-sm rounded border border-ink/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.4em] font-black bg-ink/5">
              <th className="px-6 py-6 opacity-40 border-b border-ink/10">Data do Lançamento</th>
              <th className="px-6 py-6 opacity-40 border-b border-ink/10">Histórico / Descrição</th>
              <th className="px-6 py-6 opacity-40 border-b border-ink/10 text-right">Débitos ( - )</th>
              <th className="px-6 py-6 opacity-40 border-b border-ink/10 text-right">Créditos ( + )</th>
              <th className="px-6 py-6 text-center opacity-40 border-b border-ink/10">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-ink/[0.03] group transition-colors ledger-line">
                <td className="px-6 py-5 text-xs font-black mono-font opacity-50 tabular-nums">
                  {formatDate(t.date)}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="italic font-bold text-lg tracking-wide text-ink">{t.description}</span>
                    <span className="text-[9px] uppercase font-black opacity-30 tracking-widest">{t.category}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right font-black mono-font text-base text-red-900/70 tabular-nums">
                  {t.type === TransactionType.EXPENSE ? formatCurrency(t.amount) : '—'}
                </td>
                <td className="px-6 py-5 text-right font-black mono-font text-base text-ink tabular-nums">
                  {t.type === TransactionType.INCOME ? formatCurrency(t.amount) : '—'}
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit?.(t)} 
                      className="p-2 hover:bg-ink hover:text-sepia-base transition-all rounded-sm"
                      title="Revisar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(t.id)} 
                      className="p-2 hover:bg-red-900 hover:text-white transition-all rounded-sm"
                      title="Excluir Permanentemente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <ScrollText className="w-16 h-16 mx-auto mb-6 opacity-10" />
            <p className="italic opacity-40 font-bold serif-font text-xl">Nenhum manuscrito encontrado nestas páginas amareladas.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center opacity-30 text-[10px] font-black uppercase tracking-[0.3em] pt-4">
        <span>Total de {filtered.length} escrituras</span>
        <button className="flex items-center gap-2 hover:opacity-100 transition-opacity">
          <Printer className="w-4 h-4" /> Imprimir Ledger
        </button>
      </div>
    </div>
  );
};

export default History;
