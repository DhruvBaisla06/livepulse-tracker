import { useState, useCallback, useMemo } from 'react';
import { demoSavingsGoals } from '../data/demo';
import { calcGoalProgress } from '../utils/calculations';

export function useSavings() {
  const [goals, setGoals] = useState(demoSavingsGoals);

  const goalsWithProgress = useMemo(() => goals.map(calcGoalProgress), [goals]);

  const totalSaved = useMemo(() => goals.reduce((s, g) => s + g.saved, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((s, g) => s + g.target, 0), [goals]);

  const addGoal = useCallback((goal) => {
    const newGoal = { ...goal, id: `sg-${Date.now()}`, saved: 0 };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  }, []);

  const updateGoal = useCallback((id, updates) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, []);

  const addToGoal = useCallback((id, amount) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g))
    );
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { goals: goalsWithProgress, totalSaved, totalTarget, addGoal, updateGoal, addToGoal, deleteGoal };
}
