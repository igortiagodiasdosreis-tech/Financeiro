
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getMonthName = (monthIndex: number) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[monthIndex];
};

export const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Verifica se um compromisso recorrente ocorre em um dia específico
 */
export const isOccurrenceOnDay = (startDate: string, frequency: string, targetDate: Date): boolean => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  if (target < start) return false;

  const diffDays = Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const diffMonths = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());

  switch (frequency) {
    case 'once':
      return diffDays === 0;
    case 'daily':
      return true;
    case 'weekly':
      return diffDays % 7 === 0;
    case 'biweekly':
      return diffDays % 14 === 0;
    case 'monthly':
      return target.getDate() === start.getDate();
    case 'bimonthly':
      return target.getDate() === start.getDate() && diffMonths % 2 === 0;
    case 'quarterly':
      return target.getDate() === start.getDate() && diffMonths % 3 === 0;
    case 'semiannual':
      return target.getDate() === start.getDate() && diffMonths % 6 === 0;
    case 'annual':
      return target.getDate() === start.getDate() && diffMonths % 12 === 0;
    default:
      return false;
  }
};
