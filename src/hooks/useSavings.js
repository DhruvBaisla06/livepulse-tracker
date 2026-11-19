import { useState, useCallback, useMemo, useEffect } from 'react';
import { demoSavingsGoals, adminSavingsGoals } from '../data/demo';
import { calcGoalProgress } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';

export function useSavings() {
  const { user } = useAuth();

  const getInitialGoals = () => {
    if (user?.email === 'admin@livepulse.app') return adminSavingsGoals;
    return demoSavingsGoals;
  };

  const [goals, setGoals] = useState(getInitialGoals);

  useEffect(() => {
    if (user?.email === 'admin@livepulse.app') {
      setGoals(adminSavingsGoals);
    } else {
      setGoals(demoSavingsGoals);
    }
  }, [user?.email]);

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
