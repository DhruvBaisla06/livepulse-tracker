import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, PiggyBank, Wallet, ArrowRight,
  Bell, AlertTriangle, CheckCircle, ArrowUpRight, Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { useNotifications } from '../contexts/NotificationContext';
import StatCard from '../components/dashboard/StatCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingTrend from '../components/charts/SpendingTrend';
import IncomeVsExpense from '../components/charts/IncomeVsExpense';
import CategoryPie from '../components/charts/CategoryPie';
import BudgetProgress from '../components/charts/BudgetProgress';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    transactions, totalIncome, totalExpenses, netSavings,
    categoryTotals, monthlyTrend,
  } = useTransactions();
  const { budgetUsage, budgetRemaining } = useBudgets(transactions);
  const { notifications, unreadCount } = useNotifications();

  const today = new Date();
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'User'}</span> 👋
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Financial pulse for {formatDate(today)} · Everything is running smoothly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/add-transaction">
            <Button variant="primary" icon={Plus}>
              Add Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 4 Main Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon={TrendingUp}
          trend="up"
          trendValue="+12.5% vs last month"
          color="green"
          delay={1}
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon={TrendingDown}
          trend="down"
          trendValue="-4.2% vs last month"
          color="red"
          delay={2}
        />
        <StatCard
          title="Net Savings"
          value={netSavings}
          icon={PiggyBank}
          trend="up"
          trendValue={`${savingsRate}% savings rate`}
          color="purple"
          delay={3}
        />
        <StatCard
          title="Budget Remaining"
          value={budgetRemaining}
          icon={Wallet}
          trend="up"
          trendValue="Healthy status"
          color="cyan"
          delay={4}
        />
      </div>

      {/* ── Charts Row 1: Spending Trend & Income vs Expense ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Financial Trend (6 Months)</h2>
              <p className="text-xs text-white/40">Income and Expense evolution</p>
            </div>
            <Link to="/analytics" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Details <ArrowRight size={14} />
            </Link>
          </div>
          <SpendingTrend data={monthlyTrend} />
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Income vs Expense</h2>
              <p className="text-xs text-white/40">Comparative monthly breakdown</p>
            </div>
            <Link to="/analytics" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              Details <ArrowRight size={14} />
            </Link>
          </div>
          <IncomeVsExpense data={monthlyTrend} />
        </GlassCard>
      </div>

      {/* ── Bottom Section: Category Pie, Recent Txns, Budget Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Expense Distribution</h2>
              <p className="text-xs text-white/40">This month by category</p>
            </div>
          </div>
          {categoryTotals.length > 0 ? (
            <CategoryPie data={categoryTotals} />
          ) : (
            <div className="py-12 text-center text-sm text-white/40">No expenses recorded yet</div>
          )}
        </GlassCard>

        {/* Budget Progress */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Budget Status</h2>
              <p className="text-xs text-white/40">Top category limits</p>
            </div>
            <Link to="/budgets" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              All Budgets <ArrowRight size={14} />
            </Link>
          </div>
          <BudgetProgress budgets={budgetUsage} />
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
              <p className="text-xs text-white/40">Latest activity</p>
            </div>
            <Link to="/transactions" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <RecentTransactions transactions={transactions} />
        </GlassCard>
      </div>

      {/* ── Quick Notification Banner if unread alerts ── */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl glass-light border border-purple-500/30 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-white/50">
                {notifications[0]?.title}: {notifications[0]?.message}
              </p>
            </div>
          </div>
          <Link to="/notifications">
            <Button variant="secondary" size="sm">
              View Notifications
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
