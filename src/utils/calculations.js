import { startOfMonth, endOfMonth, parseISO, isWithinInterval, subMonths, format } from 'date-fns';

// ── Filter transactions by date range ──
export const filterByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter((t) => {
    const d = typeof t.date === 'string' ? parseISO(t.date) : t.date;
    return isWithinInterval(d, { start: startDate, end: endDate });
  });
};

// ── Filter transactions for current month ──
export const filterCurrentMonth = (transactions) => {
  const now = new Date();
  return filterByDateRange(transactions, startOfMonth(now), endOfMonth(now));
};

// ── Calculate totals ──
export const calcTotal = (transactions, type) => {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + Number(t.amount), 0);
};

export const calcTotalIncome = (transactions) => calcTotal(transactions, 'income');
export const calcTotalExpenses = (transactions) => calcTotal(transactions, 'expense');
export const calcNetSavings = (transactions) =>
  calcTotalIncome(transactions) - calcTotalExpenses(transactions);

// ── Category-wise totals ──
export const calcCategoryTotals = (transactions, type = 'expense') => {
  const filtered = transactions.filter((t) => t.type === type);
  const map = {};
  filtered.forEach((t) => {
    const cat = t.category || 'Uncategorized';
    map[cat] = (map[cat] || 0) + Number(t.amount);
  });
  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
};

// ── Monthly trend data ──
export const calcMonthlyTrend = (transactions, months = 6) => {
  const now = new Date();
  const data = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const monthTxns = filterByDateRange(transactions, start, end);
    data.push({
      month: format(monthDate, 'MMM'),
      fullMonth: format(monthDate, 'MMMM yyyy'),
      income: calcTotalIncome(monthTxns),
      expenses: calcTotalExpenses(monthTxns),
      savings: calcTotalIncome(monthTxns) - calcTotalExpenses(monthTxns),
    });
  }
  return data;
};

// ── Budget usage calculations ──
export const calcBudgetUsage = (budget, transactions) => {
  const monthTxns = filterCurrentMonth(transactions);
  const spent = monthTxns
    .filter((t) => t.type === 'expense' && t.category === budget.category)
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const percent = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
  return {
    ...budget,
    spent,
    remaining: Math.max(budget.limit - spent, 0),
    percent: Math.min(percent, 100),
    overBudget: spent > budget.limit,
    status: percent >= 100 ? 'exceeded' : percent >= 80 ? 'warning' : 'normal',
  };
};

// ── Savings goal progress ──
export const calcGoalProgress = (goal) => {
  const percent = goal.target > 0 ? (goal.saved / goal.target) * 100 : 0;
  return {
    ...goal,
    percent: Math.min(percent, 100),
    remaining: Math.max(goal.target - goal.saved, 0),
    completed: goal.saved >= goal.target,
  };
};

// ── Daily spending for a month ──
export const calcDailySpending = (transactions, monthDate = new Date()) => {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const monthTxns = filterByDateRange(transactions, start, end).filter(
    (t) => t.type === 'expense'
  );
  const dailyMap = {};
  monthTxns.forEach((t) => {
    const day = format(typeof t.date === 'string' ? parseISO(t.date) : t.date, 'dd');
    dailyMap[day] = (dailyMap[day] || 0) + Number(t.amount);
  });
  const daysInMonth = end.getDate();
  const data = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    data.push({ day: dayStr, amount: dailyMap[dayStr] || 0 });
  }
  return data;
};
