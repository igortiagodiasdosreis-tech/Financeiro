
import React from 'react';
import { CreditCard } from 'lucide-react';

interface FloatingActionProps {
  onOpenInstallment: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionProps> = ({ onOpenInstallment }) => {
  return (
    <button
      onClick={onOpenInstallment}
      title="Novo Parcelamento (Shift + P)"
      className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-400 hover:scale-110 active:scale-95 transition-all z-50 group"
    >
      <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform" />
    </button>
  );
};
