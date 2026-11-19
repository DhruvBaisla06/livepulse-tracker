import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Trash2, Edit, DollarSign, Shield, TrendingUp } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { demoCategories } from '../data/demo';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatPercent } from '../utils/formatters';

const expenseCategories = demoCategories.filter((c) => c.type === 'expense');

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Budgets() {
  const { transactions } = useTransactions();
  const {
    budgetUsage, totalBudget, totalSpent, budgetRemaining,
    addBudget, updateBudget, deleteBudget,
  } = useBudgets(transactions);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const handleAdd = () => {
    if (!newCategory || !newLimit) return;
    const cat = expenseCategories.find((c) => c.name === newCategory);
    addBudget({
      category: newCategory,
      limit: Number(newLimit),
      period: 'monthly',
      color: cat?.color || '#8b5cf6',
    });
    setNewCategory('');
    setNewLimit('');
    setShowAddModal(false);
  };

  const handleEdit = () => {
    if (!editingBudget || !newLimit) return;
    updateBudget(editingBudget.id, { limit: Number(newLimit) });
    setEditingBudget(null);
    setNewLimit('');
    setShowEditModal(false);
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);
    setNewLimit(String(budget.limit));
    setShowEditModal(true);
  };

  const getStatusBadge = (status) => {
    if (status === 'exceeded') return <Badge variant="red">Exceeded</Badge>;
    if (status === 'warning') return <Badge variant="amber">Warning</Badge>;
    return <Badge variant="green">On Track</Badge>;
  };

  const summaryCards = [
    { label: 'Total Budget', value: formatCurrency(totalBudget), icon: Wallet, color: 'from-purple-500 to-purple-700' },
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: TrendingUp, color: 'from-red-500 to-red-700' },
    { label: 'Remaining', value: formatCurrency(budgetRemaining), icon: Shield, color: 'from-emerald-500 to-emerald-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Budgets</h1>
          <p className="text-white/50 text-sm mt-1">Manage your monthly spending limits</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>Add Budget</Button>
      </div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {summaryCards.map((card) => (
          <motion.div key={card.label} variants={itemVariants}>
            <GlassCard className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shrink-0`}>
                <card.icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider">{card.label}</p>
                <p className="text-xl font-bold text-white mt-0.5">{card.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Budget Cards Grid */}
      {budgetUsage.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={Wallet}
            title="No budgets yet"
            description="Create your first budget to start tracking your spending."
            action={<Button icon={Plus} onClick={() => setShowAddModal(true)}>Add Budget</Button>}
          />
        </GlassCard>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {budgetUsage.map((budget) => {
            const progressPct = Math.min((budget.spent / budget.limit) * 100, 100);
            const barColor =
              budget.status === 'exceeded'
                ? 'bg-red-500'
                : budget.status === 'warning'
                ? 'bg-amber-500'
                : 'bg-emerald-500';

            return (
              <motion.div key={budget.id} variants={itemVariants}>
                <GlassCard className="space-y-4">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: budget.color }}
                      />
                      <h3 className="text-white font-semibold text-sm">{budget.category}</h3>
                    </div>
                    {getStatusBadge(budget.status)}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>{formatPercent(progressPct)} used</span>
                      <span>{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                    </div>
                  </div>

                  {/* Remaining */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div>
                      <p className="text-xs text-white/40">Remaining</p>
                      <p className={`text-sm font-semibold ${budget.overBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                        {budget.overBudget ? '−' : ''}{formatCurrency(budget.remaining)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" icon={Edit} onClick={() => openEdit(budget)} />
                      <Button variant="ghost" size="sm" icon={Trash2} className="text-red-400 hover:text-red-300" onClick={() => deleteBudget(budget.id)} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add Budget Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Budget">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full glass px-4 py-2.5 text-sm text-white/90 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-200 rounded-xl"
            >
              <option value="" className="bg-gray-900">Select a category</option>
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.name} className="bg-gray-900">{c.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Monthly Limit"
            icon={DollarSign}
            type="number"
            placeholder="e.g. 10000"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button icon={Plus} onClick={handleAdd} disabled={!newCategory || !newLimit}>Add Budget</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Budget">
        <div className="space-y-4">
          {editingBudget && (
            <div className="flex items-center gap-2 p-3 glass rounded-xl">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: editingBudget.color }} />
              <span className="text-white font-medium text-sm">{editingBudget.category}</span>
            </div>
          )}
          <Input
            label="Monthly Limit"
            icon={DollarSign}
            type="number"
            placeholder="e.g. 10000"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button icon={Edit} onClick={handleEdit} disabled={!newLimit}>Update</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
