import { useState, useCallback, useMemo, useEffect } from 'react';
import { demoTransactions, adminTransactions } from '../data/demo';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  calcTotalIncome, calcTotalExpenses, calcNetSavings,
  calcCategoryTotals, calcMonthlyTrend, filterCurrentMonth, calcDailySpending,
} from '../utils/calculations';

export function useTransactions() {
  const { user, isDemo } = useAuth();

  // Initial state based on account role
  const getInitialTransactions = () => {
    if (user?.email === 'admin@livepulse.app') return adminTransactions;
    if (user?.email === 'demo@livepulse.app') return demoTransactions;
    if (isDemo) return demoTransactions;
    return []; // Real Supabase user starts with their real data
  };

  const [transactions, setTransactions] = useState(getInitialTransactions);
  const [loading, setLoading] = useState(false);

  // Sync / Fetch based on active user
  useEffect(() => {
    let active = true;

    // 1. If Admin Demo
    if (user?.email === 'admin@livepulse.app') {
      setTransactions(adminTransactions);
      setLoading(false);
      return;
    }

    // 2. If Standard Demo
    if (user?.email === 'demo@livepulse.app' || (isDemo && !user?.id)) {
      setTransactions(demoTransactions);
      setLoading(false);
      return;
    }

    // 3. Real Supabase Registered User
    async function loadSupabaseTransactions() {
      if (!isSupabaseConfigured() || !user?.id) {
        if (active) setTransactions([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) {
          console.warn('Error fetching Supabase transactions:', error);
          if (active) setTransactions([]);
          return;
        }

        if (active) {
          // Exactly the user's data (empty array if brand new account)
          setTransactions(data || []);
        }
      } catch (err) {
        console.warn('Failed to load transactions:', err);
        if (active) setTransactions([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSupabaseTransactions();

    // Setup Supabase Realtime Subscription for real user
    let channel = null;
    if (isSupabaseConfigured() && !isDemo && user?.id) {
      channel = supabase
        .channel(`transactions_user_${user.id}`)
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
                return [payload.new, ...prev];
              });
            } else if (payload.eventType === 'UPDATE') {
              setTransactions((prev) =>
                prev.map((t) => (t.id === payload.new.id ? payload.new : t))
              );
            } else if (payload.eventType === 'DELETE') {
              setTransactions((prev) => prev.filter((t) => t.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    }

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [user?.email, user?.id, isDemo]);

  const addTransaction = useCallback(
    async (txn) => {
      const tempId = `t-${Date.now()}`;
      const newTxn = { ...txn, id: tempId };

      // Optimistic state update
      setTransactions((prev) => [newTxn, ...prev]);

      // If logged into Supabase, save to cloud
      if (isSupabaseConfigured() && !isDemo && user?.id) {
        try {
          const { data, error } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              type: txn.type,
              category: txn.category,
              amount: txn.amount,
              description: txn.description,
              date: txn.date,
              account: txn.account || '',
            })
            .select()
            .single();

          if (error) throw error;
          if (data) {
            setTransactions((prev) =>
              prev.map((t) => (t.id === tempId ? data : t))
            );
            return data;
          }
        } catch (err) {
          console.warn('Failed to insert transaction to Supabase:', err);
        }
      }

      return newTxn;
    },
    [user?.id, isDemo]
  );

  const updateTransaction = useCallback(
    async (id, updates) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );

      if (isSupabaseConfigured() && !isDemo && user?.id) {
        try {
          await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id);
        } catch (err) {
          console.warn('Failed to update Supabase transaction:', err);
        }
      }
    },
    [user?.id, isDemo]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));

      if (isSupabaseConfigured() && !isDemo && user?.id) {
        try {
          await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
        } catch (err) {
          console.warn('Failed to delete Supabase transaction:', err);
        }
      }
    },
    [user?.id, isDemo]
  );

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
