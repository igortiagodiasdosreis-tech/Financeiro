
import React, { useState } from 'react';
import { Cloud, ShieldCheck, Link2, Trash2, Download, AlertTriangle, Code, Copy, Check, Tag, Plus, Archive } from 'lucide-react';
import { SyncConfig, Category } from '../types';
import { storageService } from '../services/storage';

interface SettingsProps {
  config: SyncConfig;
  onUpdateConfig: (config: SyncConfig) => void;
  onManualSync: () => void;
  onClearData: () => void;
  categories: Category[];
  onAddCategory: (cat: string) => void;
  onDeleteCategory: (cat: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  config, onUpdateConfig, onManualSync, onClearData, 
  categories, onAddCategory, onDeleteCategory 
}) => {
  const [url, setUrl] = useState(config.sheetsUrl);
  const [copied, setCopied] = useState(false);
  const [newCat, setNewCat] = useState('');

  const handleSave = () => {
    onUpdateConfig({ ...config, sheetsUrl: url.trim() });
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      onAddCategory(newCat.trim());
      setNewCat('');
    }
  };

  const scriptCode = `function doGet(e) {
  var action = e.parameter.action;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (action === 'syncAll') {
    var data = sheet.getDataRange().getValues();
    var headers = data.shift();
    var json = data.map(function(row) {
      return {
        id: row[0],
        date: row[1],
        description: row[2],
        category: row[3],
        type: row[4],
        amount: parseFloat(row[5])
      };
    });
    return ContentService.createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var params = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    params.id, 
    params.date, 
    params.description, 
    params.category, 
    params.type, 
    params.amount
  ]);
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-ink/10 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-ink text-sepia-base rounded-sm flex items-center justify-center shadow-xl border border-accent/40">
            <Archive className="w-8 h-8" />
          </div>
          <div>
            <h2 className="script-font text-6xl text-ink leading-tight">Oficina do Ledger</h2>
            <p className="text-ink/60 italic text-sm mt-1 uppercase tracking-[0.3em] font-black">Manutenção e Ajustes do Escriba</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Category Workshop */}
        <div className="p-8 border-2 border-ink/10 rounded-sm bg-sepia-light/30 shadow-lg space-y-8">
          <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
            <Tag className="w-6 h-6 text-accent" />
            <h3 className="script-font text-4xl text-ink">Arquivo de Categorias</h3>
          </div>

          <form onSubmit={handleAddCat} className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-ink opacity-40 mb-1 block">Nova Classificação</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Ex: Assinaturas, Hobbies..."
                className="ink-input flex-1 italic font-bold"
              />
              <button 
                type="submit"
                className="bg-ink text-sepia-base px-6 py-2 rounded-sm font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Incluir
              </button>
            </div>
          </form>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-4 custom-ledger-scroll">
            {categories.map(cat => (
              <div key={cat} className="flex items-center justify-between py-3 border-b border-ink/5 group">
                <span className="text-lg font-bold italic text-ink">{cat}</span>
                <button 
                  onClick={() => onDeleteCategory(cat)}
                  className="text-red-900 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-all p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Google Sheets Sync */}
        <div className="p-8 border-2 border-ink/10 rounded-sm bg-sepia-light/30 shadow-lg space-y-8">
          <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
            <Cloud className="w-6 h-6 text-accent" />
            <h3 className="script-font text-4xl text-ink">Sincronização Cloud</h3>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-ink opacity-40 mb-1">Web App URL (Apps Script)</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://script.google.com/..."
                  className="ink-input flex-1 text-sm font-mono opacity-70"
                />
                <button 
                  onClick={handleSave}
                  className="bg-ink text-sepia-base px-6 py-2 rounded-sm font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl"
                >
                  Salvar
                </button>
              </div>
            </div>

            <button 
              onClick={onManualSync}
              className="w-full py-3 border-2 border-ink/20 text-ink font-black uppercase tracking-[0.3em] text-[10px] hover:bg-ink/5 transition-all"
            >
              Forçar Sincronização Agora
            </button>
          </div>

          <div className="pt-4 border-t border-ink/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black text-ink/40 uppercase tracking-widest flex items-center gap-2">
                <Code className="w-3 h-3" /> Script de Automação
              </span>
              <button 
                onClick={copyToClipboard}
                className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2 hover:underline"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copiado!' : 'Copiar Código'}
              </button>
            </div>
            <pre className="text-[10px] bg-ink text-sepia-light/80 p-4 rounded-sm overflow-x-auto max-h-32 mono-font">
              {scriptCode}
            </pre>
          </div>
        </div>

        {/* Data Management */}
        <div className="lg:col-span-2 p-8 border-2 border-red-900/10 rounded-sm bg-red-900/[0.02] shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-red-900/10 text-red-900 rounded-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="script-font text-4xl text-red-900">Segurança do Registro</h3>
              <p className="text-xs text-red-900/60 font-black uppercase tracking-widest">Os dados residem em seus aposentos locais</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
             <button 
                onClick={() => {
                   const data = {
                     transactions: storageService.getTransactions(),
                     installments: storageService.getInstallments(),
                     projects: storageService.getProjects(),
                     categories: storageService.getCategories()
                   };
                   const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                   const url = URL.createObjectURL(blob);
                   const a = document.createElement('a');
                   a.href = url;
                   a.download = `ledger_backup_${new Date().toISOString().split('T')[0]}.json`;
                   a.click();
                }}
                className="bg-ink text-sepia-base px-8 py-3 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl"
              >
                <Download className="w-4 h-4" /> Baixar Cópia Física (JSON)
              </button>

              <button 
                onClick={onClearData}
                className="border-2 border-red-900/20 text-red-900 px-8 py-3 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-900 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" /> Incinerar Registros
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
