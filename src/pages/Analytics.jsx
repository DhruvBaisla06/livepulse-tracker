import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  BarChart3, TrendingUp, TrendingDown, PiggyBank, Calendar,
  ArrowUpRight, ArrowDownRight, Layers,
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import SpendingTrend from '../components/charts/SpendingTrend';
import IncomeVsExpense from '../components/charts/IncomeVsExpense';
import CategoryPie from '../components/charts/CategoryPie';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function Analytics() {
  const {
    transactions, totalIncome, totalExpenses, netSavings,
    categoryTotals, incomeCategoryTotals, monthlyTrend, dailySpending,
  } = useTransactions();

  const [timeframe, setTimeframe] = useState('6months');

  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const daysInCurrentMonth = 30;
  const avgDailySpend = Math.round(totalExpenses / daysInCurrentMonth);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics & Insights</h1>
          <p className="text-sm text-white/50 mt-1">
            Deep dive into your revenue streams, burn rates, and spending velocity
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 glass rounded-xl self-start sm:self-auto">
          {[
            { id: '1month', label: '1M' },
            { id: '3months', label: '3M' },
            { id: '6months', label: '6M' },
            { id: '1year', label: '1Y' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                timeframe === t.id
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-500/30'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary Stat Pills ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Monthly Inflow</p>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <ArrowUpRight size={13} />
            <span>+12% vs avg</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Monthly Outflow</p>
          <p className="text-xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
          <div className="flex items-center gap-1 text-[11px] text-red-400 mt-2">
            <ArrowDownRight size={13} />
            <span>-4% vs avg</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Savings Rate</p>
          <p className="text-xl font-bold text-purple-400">{formatPercent(savingsRate)}</p>
          <div className="flex items-center gap-1 text-[11px] text-purple-300 mt-2">
            <span>Target: 25%</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Avg Daily Spend</p>
          <p className="text-xl font-bold text-cyan-400">{formatCurrency(avgDailySpend)}</p>
          <div className="flex items-center gap-1 text-[11px] text-white/40 mt-2">
            <span>Across 30 days</span>
          </div>
        </GlassCard>
      </div>

      {/* ── Spending Trend Line/Area Chart ── */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Income vs Expense Trend</h2>
            <p className="text-xs text-white/40">Visualized cashflow history</p>
          </div>
        </div>
        <SpendingTrend data={monthlyTrend} />
      </GlassCard>

      {/* ── Daily Spending Bar Chart ── */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Daily Spending Activity</h2>
            <p className="text-xs text-white/40">Expense distribution across days of the current month</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dailySpending} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15,15,46,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
              formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Spent']}
            />
            <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* ── Pie charts & Category Rankings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Expenses by Category</h2>
              <p className="text-xs text-white/40">Current month distribution</p>
            </div>
          </div>
          <CategoryPie data={categoryTotals} />
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Top Spending Categories</h2>
              <p className="text-xs text-white/40">Ranked by volume</p>
            </div>
          </div>
          <div className="space-y-3.5">
            {categoryTotals.slice(0, 6).map((cat, i) => {
              const pct = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/80 font-medium">
                      {i + 1}. {cat.name}
                    </span>
                    <span className="text-white/50">
                      {formatCurrency(cat.amount)} ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ── Month-over-Month Comparison ── */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-5 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white">Historical Month-over-Month Comparison</h2>
          <p className="text-xs text-white/40">Trailing 6-month financial performance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs font-medium text-white/40 uppercase tracking-wider bg-white/[0.02]">
                <th className="py-3 px-6">Month</th>
                <th className="py-3 px-6 text-right">Income</th>
                <th className="py-3 px-6 text-right">Expenses</th>
                <th className="py-3 px-6 text-right">Net Savings</th>
                <th className="py-3 px-6 text-right">Savings Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {monthlyTrend.map((m) => {
                const rate = m.income > 0 ? Math.round((m.savings / m.income) * 100) : 0;
                return (
                  <tr key={m.fullMonth} className="hover:bg-white/[0.03] transition-colors text-sm">
                    <td className="py-3 px-6 font-medium text-white/90">{m.fullMonth}</td>
                    <td className="py-3 px-6 text-right text-emerald-400 font-medium">
                      {formatCurrency(m.income)}
                    </td>
                    <td className="py-3 px-6 text-right text-red-400 font-medium">
                      {formatCurrency(m.expenses)}
                    </td>
                    <td className="py-3 px-6 text-right text-white font-semibold">
                      {formatCurrency(m.savings)}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <Badge variant={rate >= 20 ? 'green' : rate > 0 ? 'purple' : 'red'}>
                        {rate}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
