
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LifeProject, Transaction, Emotion } from '../types';
import { formatCurrency } from '../utils';
import { Sparkles, Heart, Plus, Edit2, Trash2, X, Save, PenTool } from 'lucide-react';

interface ProjectsProps {
  projects: LifeProject[];
  transactions: Transaction[];
  onAddProject?: (project: Omit<LifeProject, 'id'>) => void;
  onUpdateProject?: (project: LifeProject) => void;
  onDeleteProject?: (id: string) => void;
}

const COLORS = ['#1a1a1a', '#4a3728', '#8b5a2b', '#2c1e14', '#5d4037', '#795548', '#a1887f'];

const Projects: React.FC<ProjectsProps> = ({ 
  projects, transactions, onAddProject, onUpdateProject, onDeleteProject 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<LifeProject | null>(null);
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [icon, setIcon] = useState('✨');

  const emotionalData = React.useMemo(() => {
    const counts = transactions.reduce((acc, t) => {
      if (t.emotion) {
        acc[t.emotion] = (acc[t.emotion] || 0) + t.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setName('');
    setTargetAmount('');
    setCurrentAmount('0');
    setIcon('✨');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: LifeProject) => {
    setEditingProject(project);
    setName(project.name);
    setTargetAmount(project.targetAmount.toString());
    setCurrentAmount(project.currentAmount.toString());
    setIcon(project.icon);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      icon
    };

    if (editingProject && onUpdateProject) {
      onUpdateProject({ ...editingProject, ...projectData });
    } else if (onAddProject) {
      onAddProject(projectData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-16 animate-fade-in pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-ink/10 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-ink text-sepia-base rounded-sm flex items-center justify-center shadow-xl border border-accent/40">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="script-font text-6xl text-ink leading-tight">Catedral de Sonhos</h2>
            <p className="text-ink/60 italic text-sm mt-1 uppercase tracking-[0.3em] font-black">Onde a matéria se converte em propósito</p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-ink text-sepia-base px-10 py-4 rounded-sm hover:scale-105 transition-all shadow-2xl font-black uppercase tracking-[0.4em] text-[11px] flex items-center gap-3"
        >
          <Plus className="w-5 h-5" /> Novo Sonho
        </button>
      </header>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => {
          const progress = Math.min((project.currentAmount / project.targetAmount) * 100, 100);
          return (
            <div key={project.id} className="relative p-8 border-2 border-ink/20 rounded-sm bg-sepia-light/30 group shadow-md hover:shadow-xl transition-all hover:border-ink/40">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(project)} className="p-1.5 hover:text-accent text-ink"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => onDeleteProject?.(project.id)} className="p-1.5 hover:text-red-900 text-ink"><Trash2 className="w-4 h-4" /></button>
              </div>

              <div className="flex items-center gap-5 mb-8">
                <span className="text-4xl filter grayscale contrast-125">{project.icon}</span>
                <div>
                  <h4 className="script-font font-bold text-ink text-4xl leading-none">{project.name}</h4>
                  <p className="text-[11px] text-ink font-black uppercase tracking-widest mt-2 opacity-60">Meta: {formatCurrency(project.targetAmount)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xl font-black mono-font text-ink">{formatCurrency(project.currentAmount)}</span>
                  <span className="text-[10px] font-black uppercase text-ink/70 tracking-tighter">{progress.toFixed(0)}% Alcançado</span>
                </div>
                <div className="h-4 bg-ink/10 border border-ink/20 p-0.5 rounded-sm overflow-hidden">
                  <div 
                    className="h-full bg-ink transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal - Estilo Ledger */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ink/80 backdrop-blur-sm animate-fade-in">
          <div className="book-container w-full max-w-xl p-12 border-2 border-accent/40 shadow-2xl">
            <div className="flex items-center justify-between mb-10 border-b border-ink/10 pb-4">
              <h3 className="script-font text-5xl text-ink">
                {editingProject ? 'Revisar Sonho' : 'Esculpir Novo Sonho'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-red-900 opacity-60 hover:opacity-100"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-4 gap-10">
                <div className="col-span-1 flex flex-col">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-ink opacity-40 mb-1">Ícone</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="ink-input text-center text-3xl"
                  />
                </div>
                <div className="col-span-3 flex flex-col">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-ink opacity-40 mb-1">Nome do Propósito</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Viagem à Europa, Carro Novo..."
                    className="ink-input italic font-bold text-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-ink opacity-40 mb-1">Meta Financeira (BRL)</label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="ink-input mono-font font-black text-lg"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-ink opacity-40 mb-1">Valor Escriturado (BRL)</label>
                  <input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="ink-input mono-font font-black text-lg"
                    required
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-ink/5">
                <button 
                  type="submit"
                  className="w-full bg-ink text-sepia-base py-5 rounded-sm font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                >
                  <Save className="w-5 h-5" /> Confirmar Assinatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cartografia Emocional */}
      <div className="relative p-12 border-2 border-ink/10 rounded-sm bg-sepia-dark/10">
        <h3 className="script-font text-6xl text-ink mb-12 flex items-center gap-6">
          <Sparkles className="w-10 h-10 text-accent" />
          Cartografia do Sentimento
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="#e8dcc4"
                  strokeWidth={8}
                >
                  {emotionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#e8dcc4', border: '3px solid #1a1a1a', color: '#1a1a1a', fontFamily: 'EB Garamond', borderRadius: '0', boxShadow: '12px 12px 0px rgba(0,0,0,0.15)', fontWeight: 'bold' }} 
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend iconType="square" wrapperStyle={{ fontWeight: 'bold', color: '#1a1a1a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-[0.5em] border-b-2 border-ink pb-3 text-ink">Insights do Espírito</h4>
            <p className="text-ink text-2xl leading-relaxed italic font-bold serif-font opacity-80">
              "Cada moeda despendida é um fragmento da alma que se exterioriza. Observar a gênese emocional de suas despesas é o primeiro passo para a soberania sobre o destino."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
