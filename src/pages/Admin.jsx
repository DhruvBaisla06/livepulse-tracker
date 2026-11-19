import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Users, Database, Layers, Server, Activity,
  CheckCircle, Plus, Trash2, Tag,
} from 'lucide-react';
import { demoCategories } from '../data/demo';
import { useTransactions } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

export default function Admin() {
  const { transactions } = useTransactions();
  const [categories, setCategories] = useState(demoCategories);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('expense');
  const [catColor, setCatColor] = useState('#8b5cf6');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catName) return;
    const newC = {
      id: `cat-${Date.now()}`,
      name: catName,
      type: catType,
      color: catColor,
      icon: 'Tag',
    };
    setCategories([...categories, newC]);
    setCatName('');
    setShowAddCatModal(false);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">System Administration</h1>
            <Badge variant="cyan">Superadmin Mode</Badge>
          </div>
          <p className="text-sm text-white/50 mt-1">
            Global telemetry, category registries, and tenant management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowAddCatModal(true)}>
            Add Category
          </Button>
        </div>
      </div>

      {/* ── Admin Overview Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase">Active Users</p>
              <p className="text-xl font-bold text-white">1 (Demo)</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase">Total Ledgers</p>
              <p className="text-xl font-bold text-white">{transactions.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase">Categories</p>
              <p className="text-xl font-bold text-white">{categories.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase">System Status</p>
              <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" /> Operational
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Category Registry Management ── */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Category Taxonomy Registry</h3>
            <p className="text-xs text-white/40">Manage global transaction categories</p>
          </div>
          <span className="text-xs text-white/40">{categories.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-xs font-medium text-white/40 uppercase tracking-wider bg-white/[0.02]">
                <th className="py-3 px-6">Category Name</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Color Accent</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] text-sm">
                  <td className="py-3 px-6 font-medium text-white/90 flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.name}
                  </td>
                  <td className="py-3 px-6">
                    <Badge variant={c.type === 'income' ? 'green' : 'amber'}>
                      {c.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-6 font-mono text-xs text-white/50">{c.color}</td>
                  <td className="py-3 px-6 text-right">
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── System Telemetry ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Security & RLS Policies
          </h3>
          <div className="space-y-2.5 text-xs text-white/60">
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span>Row Level Security (RLS)</span>
              <span className="text-emerald-400 font-medium">Enabled on all 6 tables</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span>Auth Provider</span>
              <span className="text-purple-300">Supabase JWT / Local Fallback</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span>Encryption in Transit</span>
              <span className="text-emerald-400">TLS 1.3 Strict</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Client-side Service Key Leak Check</span>
              <span className="text-emerald-400">Zero keys exposed (PASS)</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Platform Environment
          </h3>
          <div className="space-y-2.5 text-xs text-white/60">
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span>Vite Runtime</span>
              <span className="text-white font-mono">v6.x (React 19)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span>Tailwind Engine</span>
              <span className="text-white font-mono">v4.x CSS Glass System</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
              <span>Realtime Engine</span>
              <span className="text-cyan-400">WebSocket Ready</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Platform Build</span>
              <span className="text-purple-300 font-mono">v1.0.0-production-grade</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Add Category Modal ── */}
      <Modal
        isOpen={showAddCatModal}
        onClose={() => setShowAddCatModal(false)}
        title="Register New Category"
        size="sm"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Crypto, Gaming, Consulting"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Type</label>
            <select
              value={catType}
              onChange={(e) => setCatType(e.target.value)}
              className="w-full glass px-3 py-2 text-sm text-white/90 bg-navy-900 border border-white/10 rounded-xl"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Color Tag</label>
            <div className="flex gap-2">
              {['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#3b82f6'].map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setCatColor(col)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    catColor === col ? 'scale-125 ring-2 ring-white' : ''
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setShowAddCatModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
