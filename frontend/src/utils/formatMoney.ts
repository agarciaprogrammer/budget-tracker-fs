export function formatMoney(value: number | string): string {
    const number = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(number)) return "0,00";
    return number.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }