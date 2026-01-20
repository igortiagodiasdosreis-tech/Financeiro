
import React from 'react';
import { 
  Heart, 
  Ring, 
  Home, 
  Shirt, 
  Sparkles, 
  Car, 
  Briefcase, 
  Utensils, 
  Bus, 
  Activity, 
  GraduationCap, 
  Zap, 
  MoreHorizontal 
} from 'lucide-react';
import { Category, Emotion, LifeProject } from './types';

// Fix: Replaced Category.NAME with string literals as Category is a type alias for string
export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Salário': <Briefcase className="w-4 h-4" />,
  'Alimentação': <Utensils className="w-4 h-4" />,
  'Transporte': <Bus className="w-4 h-4" />,
  'Saúde': <Activity className="w-4 h-4" />,
  'Educação': <GraduationCap className="w-4 h-4" />,
  'Contas/Utilities': <Zap className="w-4 h-4" />,
  'Outros': <MoreHorizontal className="w-4 h-4" />,
};

export const EMOTION_COLORS: Record<string, string> = {
  '😊 Feliz': '#fbbf24',
  '😍 Apaixonado': '#f87171',
  '😌 Satisfeito': '#34d399',
  '😰 Ansioso': '#fb923c',
  '😢 Triste': '#60a5fa',
  '😤 Frustrado': '#f43f5e',
  '😴 Cansado': '#94a3b8',
  '😐 Neutro': '#d1d5db',
};

export const INITIAL_PROJECTS: LifeProject[] = [
  { id: '1', name: 'Relacionamento', icon: '❤️', targetAmount: 10000, currentAmount: 0 },
  { id: '2', name: 'Casamento', icon: '💍', targetAmount: 25000, currentAmount: 0 },
  { id: '3', name: 'Enxoval', icon: '🏠', targetAmount: 5000, currentAmount: 0 },
  { id: '4', name: 'Estilo', icon: '👗', targetAmount: 2000, currentAmount: 0 },
  { id: '5', name: 'Cuidados Pessoais', icon: '💅', targetAmount: 1500, currentAmount: 0 },
  { id: '6', name: 'Casita', icon: '🏡', targetAmount: 50000, currentAmount: 0 },
  { id: '7', name: 'Carro', icon: '🚗', targetAmount: 80000, currentAmount: 0 },
];
