import { useState, useCallback, useMemo, useEffect } from 'react';
import { demoBudgets, adminBudgets } from '../data/demo';
import { calcBudgetUsage } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';

export function useBudgets(transactions) {
  const { user } = useAuth();

  const getInitialBudgets = () => {
    if (user?.email === 'admin@livepulse.app') return adminBudgets;
    return demoBudgets;
  };

  const [budgets, setBudgets] = useState(getInitialBudgets);

  useEffect(() => {
    if (user?.email === 'admin@livepulse.app') {
      setBudgets(adminBudgets);
    } else {
      setBudgets(demoBudgets);
    }
  }, [user?.email]);

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
