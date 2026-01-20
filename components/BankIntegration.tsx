
import React, { useState } from 'react';
import { ShieldCheck, Landmark, RefreshCw, Plus, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { BankConnection, Transaction, TransactionType, Category } from '../types';
import { formatCurrency } from '../utils';
import { GoogleGenAI } from "@google/genai";

interface BankIntegrationProps {
  connections: BankConnection[];
  onConnect: (bankName: string) => void;
  onSync: (connectionId: string) => Promise<void>;
  isSyncing: boolean;
}

const SUPPORTED_BANKS = ['Nubank', 'Inter', 'Itaú', 'Bradesco', 'Santander', 'C6 Bank'];

const BankIntegration: React.FC<BankIntegrationProps> = ({ connections, onConnect, onSync, isSyncing }) => {
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Conexões Bancárias</h2>
          <p className="text-slate-500">Importação automática via Open Banking com IA.</p>
        </div>
        {!showSelector && (
          <button 
            onClick={() => setShowSelector(true)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" /> Conectar Novo Banco
          </button>
        )}
      </header>

      {showSelector && (
        <div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Escolha sua Instituição</h3>
            <button onClick={() => setShowSelector(false)} className="text-slate-400 hover:text-slate-600">Voltar</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SUPPORTED_BANKS.map(bank => (
              <button
                key={bank}
                onClick={() => {
                  onConnect(bank);
                  setShowSelector(false);
                }}
                className="p-6 rounded-2xl border border-slate-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center gap-3 group"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                  <Landmark className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <span className="font-bold text-slate-700">{bank}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 p-4 bg-sky-50 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
            <p className="text-xs text-sky-800 font-medium">
              Utilizamos criptografia de ponta a ponta e protocolos de segurança do Open Banking Brasil para garantir que seus dados nunca sejam expostos.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connections.length > 0 ? connections.map(conn => (
          <div key={conn.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{conn.bankName}</h4>
                  <p className="text-xs text-slate-500">Status: 
                    <span className={`ml-1 font-bold ${conn.status === 'connected' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {conn.status === 'connected' ? 'Conectado' : 'Sincronizando...'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Última Sincronização</span>
                <span className="text-xs text-slate-600 font-medium">{conn.lastSync ? new Date(conn.lastSync).toLocaleString('pt-BR') : 'Nunca'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => onSync(conn.id)}
                disabled={isSyncing}
                className="flex-1 bg-slate-800 text-white py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
              </button>
              <button className="px-4 py-2 text-slate-500 hover:text-rose-600 font-bold text-sm">Desconectar</button>
            </div>
          </div>
        )) : !showSelector && (
          <div className="md:col-span-2 flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400">
            <Sparkles className="w-12 h-12 mb-4 text-indigo-300" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Automatize sua vida financeira</h3>
            <p className="max-w-md text-center text-sm mb-8 px-6">
              Conecte suas contas bancárias para importar transações automaticamente. Nossa IA categoriza tudo para você e analisa suas emoções.
            </p>
            <button 
              onClick={() => setShowSelector(true)}
              className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center gap-2"
            >
              Começar Agora <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Categorização Inteligente
          </h3>
          <p className="text-indigo-200 text-sm max-w-xl">
            Sua privacidade é prioridade. Ao importar transações, nossa IA local analisa os metadados bancários para sugerir a melhor categoria e identificar padrões emocionais sem que seus dados sensíveis saiam do seu dispositivo.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>
    </div>
  );
};

export default BankIntegration;
