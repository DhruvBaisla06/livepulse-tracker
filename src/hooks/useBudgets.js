import { useState, useCallback, useMemo } from 'react';
import { demoBudgets } from '../data/demo';
import { calcBudgetUsage } from '../utils/calculations';

export function useBudgets(transactions) {
  const [budgets, setBudgets] = useState(demoBudgets);

  const budgetUsage = useMemo(
    () => budgets.map((b) => calcBudgetUsage(b, transactions)),
    [budgets, transactions]
  );

  const totalBudget = useMemo(() => budgets.reduce((s, b) => s + b.limit, 0), [budgets]);
  const totalSpent = useMemo(() => budgetUsage.reduce((s, b) => s + b.spent, 0), [budgetUsage]);
  const budgetRemaining = useMemo(() => Math.max(totalBudget - totalSpent, 0), [totalBudget, totalSpent]);

  const addBudget = useCallback((budget) => {
    const newBudget = { ...budget, id: `b-${Date.now()}` };
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  }, []);

  const updateBudget = useCallback((id, updates) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, []);

  const deleteBudget = useCallback((id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { budgets, budgetUsage, totalBudget, totalSpent, budgetRemaining, addBudget, updateBudget, deleteBudget };
}
