export const getLocalDateFromStr = (dateStr: string): Date => {
  // Parseamos la fecha ignorando la zona horaria
  const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number);
  // Creamos la fecha en la zona horaria local
  return new Date(year, month - 1, day, 12, 0, 0);
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth();
};

export const formatDateToLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (dateStr: string): string => {
  // Parseamos la fecha ignorando la zona horaria
  const [year, month, day] = dateStr.substring(0, 10).split('-').map(Number);
  // Creamos la fecha en la zona horaria local
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}; 