
import React, { useState } from 'react';
import { 
  Cloud, ShieldCheck, Trash2, Download, Archive, 
  LogOut, Landmark, Tag, Plus, Code, Copy, 
  Check, Info, ExternalLink, Key, AlertTriangle
} from 'lucide-react';
import { SyncConfig, Category, User } from '../types';
import { storageService } from '../services/storage';

interface SettingsProps {
  config: SyncConfig;
  onUpdateConfig: (config: SyncConfig) => void;
  onManualSync: () => void;
  onClearData: () => void;
  categories: Category[];
  onAddCategory: (cat: string) => void;
  onDeleteCategory: (cat: string) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  googleClientId?: string;
  onUpdateClientId?: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  config, onUpdateConfig, onManualSync, onClearData, 
  categories, onAddCategory, onDeleteCategory,
  user, onLogin, onLogout, googleClientId = '', onUpdateClientId
}) => {
  const [newCat, setNewCat] = useState('');
  const [clientId, setClientId] = useState(googleClientId);
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      onAddCategory(newCat.trim());
      setNewCat('');
    }
  };

  const handleSaveClientId = () => {
    if (onUpdateClientId) onUpdateClientId(clientId.trim());
  };

  const copyOrigin = () => {
    const origin = window.location.origin;
    navigator.clipboard.writeText(origin);
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

      {/* Google Identity Configuration */}
      <div className="p-8 border-2 border-accent/20 rounded-sm bg-accent/5 shadow-lg space-y-8">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-ink text-accent rounded-full flex items-center justify-center border-4 border-accent/20 shadow-inner overflow-hidden">
              {user ? <img src={user.picture} className="w-full h-full object-cover" alt="Perfil" /> : <Key className="w-10 h-10" />}
            </div>
            <div>
              <h3 className="script-font text-4xl text-ink leading-none mb-2">
                {user ? `Escriba: ${user.name}` : 'Identidade Digital'}
              </h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-ink/40">
                {user ? `Sincronizado com ${user.email}` : 'Conecte sua conta para persistência universal.'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {user ? (
              <button onClick={onLogout} className="flex items-center gap-3 px-8 py-3 border-2 border-red-900/30 text-red-900 font-black uppercase tracking-widest text-[10px] hover:bg-red-900 hover:text-white transition-all rounded-sm">
                <LogOut className="w-4 h-4" /> Desvincular
              </button>
            ) : (
              <button onClick={onLogin} className="flex items-center gap-3 px-10 py-4 bg-ink text-sepia-base font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-2xl rounded-sm">
                <ShieldCheck className="w-5 h-5 text-accent" /> Autenticar
              </button>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-ink/10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-ink opacity-40">Google Client ID Personalizado</label>
                <button 
                  onClick={() => setShowGuide(!showGuide)}
                  className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1 hover:underline"
                >
                  <Info className="w-3 h-3" /> {showGuide ? 'Ocultar Guia' : 'Como obter?'}
                </button>
              </div>
              <input 
                type="text" 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="xxxx-xxxx.apps.googleusercontent.com"
                className="ink-input w-full font-mono text-xs opacity-70"
              />
            </div>
            <button 
              onClick={handleSaveClientId}
              className="bg-ink text-sepia-base px-8 py-3 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-colors"
            >
              Salvar ID
            </button>
          </div>

          {showGuide && (
            <div className="bg-ink text-sepia-light/90 p-6 rounded-sm space-y-6 animate-fade-in border-l-4 border-accent text-xs leading-relaxed">
              <div className="flex items-start gap-4 p-4 bg-red-900/10 border border-red-900/20 rounded-sm">
                <AlertTriangle className="w-5 h-5 text-red-900 shrink-0 mt-1" />
                <div>
                  <h4 className="font-black text-red-900 uppercase tracking-widest mb-1">Atenção Escriba: Erro 400?</h4>
                  <p className="opacity-80">O erro "invalid_request" ocorre se você não autorizou esta URL no Console do Google ou se o ID não é do tipo <strong>"Aplicativo da Web"</strong>.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black uppercase tracking-widest flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" /> Guia do Console Google Cloud
                </h4>
                <ol className="list-decimal list-inside space-y-3 opacity-80">
                  <li>Acesse o <a href="https://console.cloud.google.com/" target="_blank" className="underline text-accent">Google Cloud Console</a>.</li>
                  <li>No menu, vá em <strong>APIs e Serviços > Credenciais</strong>.</li>
                  <li>Clique em <strong>Criar Credenciais > ID do cliente OAuth</strong>.</li>
                  <li>Escolha o Tipo: <strong>Aplicativo da Web</strong> (Obrigatório).</li>
                  <li className="space-y-2">
                    <span>Em <strong>Origens JavaScript autorizadas</strong>, adicione exatamente esta URL:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-white/10 px-3 py-1 rounded font-mono text-accent">{window.location.origin}</code>
                      <button onClick={copyOrigin} className="p-1 hover:text-white transition-colors">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </li>
                  <li>Copie o ID gerado e cole no campo acima.</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>

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

        {/* Cloud Sync Status */}
        <div className="p-8 border-2 border-ink/10 rounded-sm bg-sepia-light/30 shadow-lg space-y-8">
          <div className="flex items-center gap-4 border-b border-ink/10 pb-4">
            <Cloud className="w-6 h-6 text-accent" />
            <h3 className="script-font text-4xl text-ink">Estado da Nuvem</h3>
          </div>

          <div className="space-y-6">
            <p className="text-sm italic opacity-60">
              O Ledger utiliza o diretório <strong>appDataFolder</strong> do seu Google Drive. Este é um compartimento oculto e seguro onde apenas este tomo pode ler e escrever.
            </p>
            <button 
              onClick={onManualSync}
              className="w-full py-3 border-2 border-ink/20 text-ink font-black uppercase tracking-[0.3em] text-[10px] hover:bg-ink/5 transition-all"
            >
              Forçar Sincronização Agora
            </button>
          </div>

          <div className="pt-4 border-t border-ink/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
             <span>Protocolo de Segurança: OAuth 2.0</span>
             <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-8 border-2 border-red-900/10 rounded-sm bg-red-900/[0.02] shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-red-900/10 text-red-900 rounded-sm">
            <Trash2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="script-font text-4xl text-red-900">Incinerar Registros</h3>
            <p className="text-xs text-red-900/60 font-black uppercase tracking-widest">Ação irreversível sobre o tomo local</p>
          </div>
        </div>
        <button 
          onClick={onClearData}
          className="border-2 border-red-900/20 text-red-900 px-8 py-3 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-900 hover:text-white transition-all"
        >
          Limpar Tudo
        </button>
      </div>
    </div>
  );
};

export default Settings;
