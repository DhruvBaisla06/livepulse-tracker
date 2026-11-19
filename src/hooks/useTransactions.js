import { useState, useCallback, useMemo } from 'react';
import { demoTransactions } from '../data/demo';
import { calcTotalIncome, calcTotalExpenses, calcNetSavings, calcCategoryTotals, calcMonthlyTrend, filterCurrentMonth, calcDailySpending } from '../utils/calculations';

export function useTransactions() {
  const [transactions, setTransactions] = useState(demoTransactions);
  const [loading, setLoading] = useState(false);

  const addTransaction = useCallback((txn) => {
    const newTxn = { ...txn, id: `t-${Date.now()}` };
    setTransactions((prev) => [newTxn, ...prev]);
    return newTxn;
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const currentMonthTxns = useMemo(() => filterCurrentMonth(transactions), [transactions]);
  const totalIncome = useMemo(() => calcTotalIncome(currentMonthTxns), [currentMonthTxns]);
  const totalExpenses = useMemo(() => calcTotalExpenses(currentMonthTxns), [currentMonthTxns]);
  const netSavings = useMemo(() => calcNetSavings(currentMonthTxns), [currentMonthTxns]);
  const categoryTotals = useMemo(() => calcCategoryTotals(currentMonthTxns), [currentMonthTxns]);
  const incomeCategoryTotals = useMemo(() => calcCategoryTotals(currentMonthTxns, 'income'), [currentMonthTxns]);
  const monthlyTrend = useMemo(() => calcMonthlyTrend(transactions, 6), [transactions]);
  const dailySpending = useMemo(() => calcDailySpending(transactions), [transactions]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    currentMonthTxns,
    totalIncome,
    totalExpenses,
    netSavings,
    categoryTotals,
    incomeCategoryTotals,
    monthlyTrend,
    dailySpending,
  };
}
