import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PiggyBank, Plus, Trash2, Target, TrendingUp, Calendar,
  DollarSign, CheckCircle, Shield, Wallet,
} from 'lucide-react';
import { useSavings } from '../hooks/useSavings';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';

const iconOptions = [
  { name: 'Shield', Icon: Shield },
  { name: 'Target', Icon: Target },
  { name: 'PiggyBank', Icon: PiggyBank },
  { name: 'TrendingUp', Icon: TrendingUp },
  { name: 'Wallet', Icon: Wallet },
  { name: 'DollarSign', Icon: DollarSign },
];

const colorOptions = [
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#3b82f6',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Savings() {
  const { goals, totalSaved, totalTarget, addGoal, addToGoal, deleteGoal } = useSavings();

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Add Goal form state
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalIcon, setGoalIcon] = useState('Shield');
  const [goalColor, setGoalColor] = useState('#8b5cf6');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Add Money form state
  const [addAmount, setAddAmount] = useState('');

  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const resetGoalForm = () => {
    setGoalName('');
    setGoalTarget('');
    setGoalIcon('Shield');
    setGoalColor('#8b5cf6');
    setGoalDeadline('');
  };

  const handleAddGoal = () => {
    if (!goalName || !goalTarget) return;
    addGoal({
      name: goalName,
      target: Number(goalTarget),
      icon: goalIcon,
      color: goalColor,
      deadline: goalDeadline || null,
    });
    resetGoalForm();
    setShowAddGoalModal(false);
  };

  const handleAddMoney = () => {
    if (!selectedGoal || !addAmount || Number(addAmount) <= 0) return;
    addToGoal(selectedGoal.id, Number(addAmount));
    setAddAmount('');
    setSelectedGoal(null);
    setShowAddMoneyModal(false);
  };

  const openAddMoney = (goal) => {
    setSelectedGoal(goal);
    setAddAmount('');
    setShowAddMoneyModal(true);
  };

  const getGoalIcon = (iconName) => {
    const found = iconOptions.find((o) => o.name === iconName);
    return found ? found.Icon : Target;
  };

  const summaryCards = [
    { label: 'Total Saved', value: formatCurrency(totalSaved), icon: PiggyBank, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Total Target', value: formatCurrency(totalTarget), icon: Target, color: 'from-purple-500 to-purple-700' },
    { label: 'Overall Progress', value: formatPercent(overallProgress), icon: TrendingUp, color: 'from-cyan-500 to-cyan-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
          <p className="text-white/50 text-sm mt-1">Track and grow your savings</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddGoalModal(true)}>Add Goal</Button>
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

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <GlassCard>
          <EmptyState
            icon={PiggyBank}
            title="No savings goals yet"
            description="Create your first savings goal and start building towards your dreams."
            action={<Button icon={Plus} onClick={() => setShowAddGoalModal(true)}>Add Goal</Button>}
          />
        </GlassCard>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {goals.map((goal) => {
            const GoalIcon = getGoalIcon(goal.icon);
            return (
              <motion.div key={goal.id} variants={itemVariants}>
                <GlassCard className="space-y-4 relative overflow-hidden">
                  {/* Completed overlay badge */}
                  {goal.completed && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="green" className="flex items-center gap-1">
                        <CheckCircle size={12} />
                        Completed
                      </Badge>
                    </div>
                  )}

                  {/* Goal Name & Icon */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      <GoalIcon size={20} style={{ color: goal.color }} />
                    </div>
                    <h3 className="text-white font-semibold">{goal.name}</h3>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.percent}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/50">
                      <span>{formatCurrency(goal.saved)} / {formatCurrency(goal.target)}</span>
                      <span className="font-semibold text-white/80">{formatPercent(goal.percent)}</span>
                    </div>
                  </div>

                  {/* Deadline */}
                  {goal.deadline && (
                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                      <Calendar size={13} />
                      <span>Deadline: {formatDate(goal.deadline)}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    {!goal.completed ? (
                      <Button variant="success" size="sm" icon={Plus} onClick={() => openAddMoney(goal)}>
                        Add Money
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-medium">🎉 Goal reached!</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      className="text-red-400 hover:text-red-300"
                      onClick={() => deleteGoal(goal.id)}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add Goal Modal */}
      <Modal isOpen={showAddGoalModal} onClose={() => { setShowAddGoalModal(false); resetGoalForm(); }} title="Add Savings Goal">
        <div className="space-y-4">
          <Input
            label="Goal Name"
            icon={Target}
            placeholder="e.g. Emergency Fund"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
          <Input
            label="Target Amount"
            icon={DollarSign}
            type="number"
            placeholder="e.g. 100000"
            value={goalTarget}
            onChange={(e) => setGoalTarget(e.target.value)}
          />

          {/* Icon Select */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map(({ name, Icon }) => (
                <button
                  key={name}
                  onClick={() => setGoalIcon(name)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    goalIcon === name
                      ? 'bg-purple-500/30 ring-2 ring-purple-500/60'
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} className="text-white/70" />
                </button>
              ))}
            </div>
          </div>

          {/* Color Select */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setGoalColor(c)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    goalColor === c ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white/60 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Input
            label="Deadline"
            icon={Calendar}
            type="date"
            value={goalDeadline}
            onChange={(e) => setGoalDeadline(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setShowAddGoalModal(false); resetGoalForm(); }}>Cancel</Button>
            <Button icon={Plus} onClick={handleAddGoal} disabled={!goalName || !goalTarget}>Create Goal</Button>
          </div>
        </div>
      </Modal>

      {/* Add Money Modal */}
      <Modal isOpen={showAddMoneyModal} onClose={() => setShowAddMoneyModal(false)} title="Add Money to Goal">
        <div className="space-y-4">
          {selectedGoal && (
            <GlassCard hover={false} className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{selectedGoal.name}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  {formatCurrency(selectedGoal.saved)} saved of {formatCurrency(selectedGoal.target)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40">Remaining</p>
                <p className="text-sm font-semibold text-cyan-400">{formatCurrency(selectedGoal.remaining)}</p>
              </div>
            </GlassCard>
          )}
          <Input
            label="Amount"
            icon={DollarSign}
            type="number"
            placeholder="e.g. 5000"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowAddMoneyModal(false)}>Cancel</Button>
            <Button icon={Plus} onClick={handleAddMoney} disabled={!addAmount || Number(addAmount) <= 0}>Add Money</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
