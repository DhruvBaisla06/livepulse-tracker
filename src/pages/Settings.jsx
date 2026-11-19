import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Shield, Bell, Key, Globe, Check,
  Database, AlertTriangle, Save,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

export default function Settings() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.full_name || 'Arjun Mehta');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [dateFormat, setDateFormat] = useState('dd MMM yyyy');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification Toggles
  const [notifyBudget, setNotifyBudget] = useState(true);
  const [notifyLargeTxn, setNotifyLargeTxn] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ full_name: name, currency });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-white/50 mt-1">
          Configure personal details, display preferences, and notifications
        </p>
      </div>

      {/* ── Profile Section ── */}
      <GlassCard>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.08]">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-white font-bold text-xl">
              {name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <p className="text-xs text-white/40">{user?.email}</p>
            <div className="mt-1.5 flex gap-2">
              <Badge variant="purple">Pro Plan</Badge>
              <Badge variant="cyan">Demo Active</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              icon={Mail}
              value={user?.email || ''}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full glass px-3 py-2 text-sm text-white/90 bg-navy-900 border border-white/10 rounded-xl"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Date Display Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full glass px-3 py-2 text-sm text-white/90 bg-navy-900 border border-white/10 rounded-xl"
              >
                <option value="dd MMM yyyy">DD MMM YYYY (e.g. 18 Nov 2026)</option>
                <option value="yyyy-MM-dd">YYYY-MM-DD (e.g. 2026-11-18)</option>
                <option value="MM/dd/yyyy">MM/DD/YYYY (e.g. 11/18/2026)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <Check size={16} /> Changes saved successfully!
              </span>
            ) : <span />}

            <Button type="submit" variant="primary" icon={Save}>
              Save Preferences
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* ── Notification Toggles ── */}
      <GlassCard>
        <h3 className="text-base font-semibold text-white mb-4">Notification Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/90">Budget Threshold Warnings</p>
              <p className="text-xs text-white/40">Alert when spending exceeds 80% or 100% of category budget</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifyBudget(!notifyBudget)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                notifyBudget ? 'bg-purple-600' : 'bg-white/10'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notifyBudget ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
            <div>
              <p className="text-sm font-medium text-white/90">Large Transaction Spikes</p>
              <p className="text-xs text-white/40">Notify when an expense is 3x higher than average</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifyLargeTxn(!notifyLargeTxn)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                notifyLargeTxn ? 'bg-purple-600' : 'bg-white/10'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notifyLargeTxn ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
            <div>
              <p className="text-sm font-medium text-white/90">Weekly Financial Digest</p>
              <p className="text-xs text-white/40">Send summary report on Sunday evening</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifyWeeklyDigest(!notifyWeeklyDigest)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                notifyWeeklyDigest ? 'bg-purple-600' : 'bg-white/10'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notifyWeeklyDigest ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* ── Supabase & Cloud Integration Section ── */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <Database size={20} className="text-cyan-400" />
          <h3 className="text-base font-semibold text-white">Database & Realtime Status</h3>
        </div>
        <p className="text-xs text-white/60 mb-4 leading-relaxed">
          LivePulse is currently executing on the resilient local demo datastore. To activate Supabase PostgreSQL and Realtime subscriptions, add your project credentials to <code className="text-purple-300 bg-white/5 px-1 py-0.5 rounded">.env</code>.
        </p>

        <div className="p-3.5 glass rounded-xl text-xs space-y-1.5 font-mono text-white/70">
          <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
          <div>VITE_SUPABASE_ANON_KEY=your-anon-public-key</div>
        </div>
      </GlassCard>

      {/* ── Danger Zone ── */}
      <GlassCard className="border border-red-500/20 bg-red-500/[0.02]">
        <div className="flex items-center gap-2 mb-2 text-red-400">
          <AlertTriangle size={18} />
          <h3 className="text-sm font-semibold">Danger Zone</h3>
        </div>
        <p className="text-xs text-white/40 mb-4">
          Irreversible actions related to your live personal ledger.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" size="sm">
            Reset Demo Data
          </Button>
          <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10">
            Delete Account
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
