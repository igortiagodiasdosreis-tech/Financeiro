
import React from 'react';
import { Bell, Check, Trash2, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import { Notification, Reminder } from '../types';
import { formatCurrency } from '../utils';

interface NotificationCenterProps {
  notifications: Notification[];
  reminders: Reminder[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onDeleteReminder: (id: string) => void;
  onCompleteReminder: (id: string) => void;
  onNavigate: (tab: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, 
  reminders, 
  onMarkRead, 
  onClearAll, 
  onDeleteReminder, 
  onCompleteReminder,
  onNavigate 
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Notificações & Lembretes
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount} novas</span>
            )}
          </h2>
          <p className="text-slate-500">Acompanhe seus alertas financeiros e prazos.</p>
        </div>
        <button 
          onClick={onClearAll}
          className="text-sm text-slate-500 hover:text-rose-600 font-medium"
        >
          Limpar tudo
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts List */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Alertas do Sistema</h3>
          <div className="space-y-3">
            {notifications.length > 0 ? notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  notif.read ? 'bg-white border-slate-100 opacity-75' : 'bg-indigo-50 border-indigo-100 shadow-sm'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-2 rounded-xl h-fit ${
                    notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    notif.type === 'error' ? 'bg-rose-100 text-rose-600' :
                    'bg-sky-100 text-sky-600'
                  }`}>
                    {notif.type === 'success' ? <TrendingUp className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-800 text-sm">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400">{new Date(notif.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{notif.message}</p>
                    <div className="flex items-center gap-3">
                      {!notif.read && (
                        <button 
                          onClick={() => onMarkRead(notif.id)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Marcar como lida
                        </button>
                      )}
                      {notif.action && (
                        <button 
                          onClick={() => onNavigate(notif.action!.tab)}
                          className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50"
                        >
                          {notif.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>Nenhuma notificação nova.</p>
              </div>
            )}
          </div>
        </section>

        {/* Reminders List */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Próximos Pagamentos</h3>
          <div className="space-y-3">
            {reminders.length > 0 ? reminders.map(reminder => (
              <div 
                key={reminder.id} 
                className={`p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group ${
                  reminder.completed ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onCompleteReminder(reminder.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      reminder.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    {reminder.completed && <Check className="w-4 h-4" />}
                  </button>
                  <div>
                    <h4 className={`font-bold text-sm ${reminder.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {reminder.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] text-slate-500 font-medium">
                        Vence em {new Date(reminder.dueDate).toLocaleDateString('pt-BR')} • {reminder.frequency === 'monthly' ? 'Mensal' : 'Único'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {reminder.amount && (
                    <span className="font-bold text-slate-700 text-sm">{formatCurrency(reminder.amount)}</span>
                  )}
                  <button 
                    onClick={() => onDeleteReminder(reminder.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>Sem lembretes configurados.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default NotificationCenter;
