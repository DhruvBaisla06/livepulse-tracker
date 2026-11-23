import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { demoTransactions, adminTransactions } from '../data/demo';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from './AuthContext';
import {
  calcTotalIncome, calcTotalExpenses, calcNetSavings,
  calcCategoryTotals, calcMonthlyTrend, filterCurrentMonth, calcDailySpending,
} from '../utils/calculations';

const TransactionContext = createContext(null);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export function TransactionProvider({ children }) {
  const { user, isDemo } = useAuth();

  // Storage key based on logged-in user
  const storageKey = useMemo(() => {
    return `livepulse_txns_${user?.email || (isDemo ? 'demo' : 'guest')}`;
  }, [user?.email, isDemo]);

  // Initial loader: check localStorage first, else default data
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved transactions from localStorage:', e);
    }

    if (user?.email === 'admin@livepulse.app') return adminTransactions;
    if (user?.email === 'demo@livepulse.app' || isDemo) return demoTransactions;
    return [];
  };

  const [transactions, setTransactions] = useState(loadInitialData);
  const [loading, setLoading] = useState(false);

  // When user account changes, load their appropriate data
  useEffect(() => {
    let active = true;

    // If Supabase real user
    if (isSupabaseConfigured() && !isDemo && user?.id) {
      async function fetchSupabaseData() {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

          if (error) {
            console.warn('Error fetching Supabase transactions:', error);
            return;
          }

          if (active && data) {
            setTransactions(data);
            try {
              localStorage.setItem(storageKey, JSON.stringify(data));
            } catch (err) {}
          }
        } catch (err) {
          console.warn('Failed to load transactions:', err);
        } finally {
          if (active) setLoading(false);
        }
      }

      fetchSupabaseData();

      // Setup Supabase Realtime Subscription
      const channel = supabase
        .channel(`txns_live_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setTransactions((prev) => {
                if (prev.some((t) => t.id === payload.new.id)) return prev;
                const updated = [payload.new, ...prev];
                try {
                  localStorage.setItem(storageKey, JSON.stringify(updated));
                } catch (e) {}
                return updated;
              });
            } else if (payload.eventType === 'UPDATE') {
              setTransactions((prev) => {
                const updated = prev.map((t) => (t.id === payload.new.id ? payload.new : t));
                try {
                  localStorage.setItem(storageKey, JSON.stringify(updated));
                } catch (e) {}
                return updated;
              });
            } else if (payload.eventType === 'DELETE') {
              setTransactions((prev) => {
                const updated = prev.filter((t) => t.id !== payload.old.id);
                try {
                  localStorage.setItem(storageKey, JSON.stringify(updated));
                } catch (e) {}
                return updated;
              });
            }
          }
        )
        .subscribe();

      return () => {
        active = false;
        supabase.removeChannel(channel);
      };
    } else {
      // Demo / Admin / Local mode: reload from localStorage or defaults
      const initial = loadInitialData();
      setTransactions(initial);
    }
  }, [user?.email, user?.id, isDemo, storageKey]);

  // Persist helper
  const saveToStorage = (updated) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  // ── ADD TRANSACTION ──
  const addTransaction = useCallback(
    async (txn) => {
      const tempId = `t-${Date.now()}`;
      const newTxn = {
        id: tempId,
        date: txn.date || new Date().toISOString().split('T')[0],
        ...txn,
        amount: Number(txn.amount),
      };

      // 1. Immediately update global React state so Dashboard reflects it right away!
      setTransactions((prev) => {
        const next = [newTxn, ...prev];
        saveToStorage(next);
        return next;
      });

      // 2. If logged into Supabase cloud, sync to database
      if (isSupabaseConfigured() && !isDemo && user?.id) {
        try {
          const { data, error } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              type: txn.type,
              category: txn.category,
              amount: Number(txn.amount),
              description: txn.description,
              date: newTxn.date,
              account: txn.account || '',
            })
            .select()
            .single();

          if (error) throw error;

          if (data) {
            setTransactions((prev) => {
              const updated = prev.map((t) => (t.id === tempId ? data : t));
              saveToStorage(updated);
              return updated;
            });
            return data;
          }
        } catch (err) {
          console.warn('Supabase insert warning (saved locally):', err);
        }
      }

      return newTxn;
    },
    [user?.id, isDemo, storageKey]
  );

  // ── UPDATE TRANSACTION ──
  const updateTransaction = useCallback(
    async (id, updates) => {
      setTransactions((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
        saveToStorage(next);
        return next;
      });

      if (isSupabaseConfigured() && !isDemo && user?.id) {
        try {
          await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id);
        } catch (err) {
          console.warn('Supabase update warning:', err);
        }
      }
    },
    [user?.id, isDemo, storageKey]
  );

  // ── DELETE TRANSACTION ──
  const deleteTransaction = useCallback(
    async (id) => {
      setTransactions((prev) => {
        const next = prev.filter((t) => t.id !== id);
        saveToStorage(next);
        return next;
      });

      if (isSupabaseConfigured() && !isDemo && user?.id) {
        try {
          await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
        } catch (err) {
          console.warn('Supabase delete warning:', err);
        }
      }
    },
    [user?.id, isDemo, storageKey]
  );

  // ── RESET TO ORIGINAL DEMO DATA ──
  const resetTransactions = useCallback(() => {
    const defaultData =
      user?.email === 'admin@livepulse.app'
        ? adminTransactions
        : user?.email === 'demo@livepulse.app' || isDemo
        ? demoTransactions
        : [];
    setTransactions(defaultData);
    saveToStorage(defaultData);
  }, [user?.email, isDemo, storageKey]);

  // Derived calculations
  const currentMonthTxns = useMemo(() => {
    const filtered = filterCurrentMonth(transactions);
    // If transactions exist but none fall in current calendar month, show all so figures reflect the user's data!
    return filtered.length > 0 ? filtered : transactions;
  }, [transactions]);
  const totalIncome = useMemo(() => calcTotalIncome(currentMonthTxns), [currentMonthTxns]);
  const totalExpenses = useMemo(() => calcTotalExpenses(currentMonthTxns), [currentMonthTxns]);
  const netSavings = useMemo(() => calcNetSavings(currentMonthTxns), [currentMonthTxns]);
  const categoryTotals = useMemo(() => calcCategoryTotals(currentMonthTxns), [currentMonthTxns]);
  const incomeCategoryTotals = useMemo(() => calcCategoryTotals(currentMonthTxns, 'income'), [currentMonthTxns]);
  const monthlyTrend = useMemo(() => calcMonthlyTrend(transactions, 6), [transactions]);
  const dailySpending = useMemo(() => calcDailySpending(transactions), [transactions]);

  const value = {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetTransactions,
    currentMonthTxns,
    totalIncome,
    totalExpenses,
    netSavings,
    categoryTotals,
    incomeCategoryTotals,
    monthlyTrend,
    dailySpending,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
