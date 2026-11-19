import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownRight, DollarSign, Calendar,
  CreditCard, Tag, FileText, Check, ArrowLeft,
} from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useNotifications } from '../contexts/NotificationContext';
import { demoCategories } from '../data/demo';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();
  const { addNotification } = useNotifications();

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState('HDFC Bank');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Available categories based on chosen type
  const availableCategories = demoCategories.filter((c) => c.type === type);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description');
      return;
    }

    // Add transaction
    const newTxn = addTransaction({
      type,
      amount: Number(amount),
      category,
      description,
      date,
      account,
    });

    // Fire budget / transaction notification
    addNotification({
      type: type === 'income' ? 'success' : 'info',
      title: type === 'income' ? 'Income Logged' : 'Expense Logged',
      message: `${description} for ₹${Number(amount).toLocaleString('en-IN')} was added.`,
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/transactions');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl glass hover:bg-white/10 text-white/60 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Add Transaction</h1>
          <p className="text-sm text-white/50">Log an income source or an expense record</p>
        </div>
      </div>

      <GlassCard className="p-6 md:p-8 relative overflow-hidden">
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-20 bg-navy-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/40">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Transaction Added!</h3>
            <p className="text-sm text-white/50">Recalculating dashboard balances...</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Transaction Type</label>
            <div className="grid grid-cols-2 gap-3 p-1.5 glass rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('');
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  type === 'expense'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30 shadow-lg shadow-red-500/10'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <ArrowDownRight size={18} />
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('');
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <ArrowUpRight size={18} />
                Income
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-purple-400">₹</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full glass pl-10 pr-4 py-4 text-2xl font-bold text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                required
                min="1"
                step="any"
              />
            </div>
          </div>

          {/* Description */}
          <Input
            label="Description"
            icon={FileText}
            placeholder="e.g. Swiggy dinner, Salary, Client payment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/70">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
              {availableCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.name)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                    category === c.name
                      ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-sm'
                      : 'border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Account row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Transaction Date"
              type="date"
              icon={Calendar}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/70">Payment Method / Account</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full glass px-4 py-2.5 text-sm text-white/90 bg-navy-900 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Card">ICICI Card</option>
                <option value="UPI">UPI (Google Pay / PhonePe)</option>
                <option value="Paytm">Paytm</option>
                <option value="Cash">Cash</option>
                <option value="PayPal">PayPal</option>
                <option value="Zerodha">Zerodha</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={type === 'income' ? ArrowUpRight : ArrowDownRight}
            >
              Add {type === 'income' ? 'Income' : 'Expense'} Record
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
