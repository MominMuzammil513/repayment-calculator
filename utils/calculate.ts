export function calculateMortgage(
  amount: number,
  years: number,
  rate: number,
  type: 'repayment' | 'interest-only'
): { monthlyPayment: number; totalRepayment: number } {
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = years * 12;

  if (type === 'interest-only') {
    const monthlyPayment = amount * monthlyRate;
    const totalRepayment = (monthlyPayment * numberOfPayments) + amount;
    return {
      monthlyPayment,
      totalRepayment
    };
  }

  const monthlyPayment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalRepayment = monthlyPayment * numberOfPayments;

  return {
    monthlyPayment,
    totalRepayment
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

