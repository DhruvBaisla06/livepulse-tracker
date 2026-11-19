import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'purple', delay = 0 }) {
  const colorMap = {
    purple: { bg: 'from-purple-500/20 to-purple-600/5', icon: 'text-purple-400', glow: 'shadow-purple-500/10' },
    cyan: { bg: 'from-cyan-500/20 to-cyan-600/5', icon: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
    green: { bg: 'from-emerald-500/20 to-emerald-600/5', icon: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
    amber: { bg: 'from-amber-500/20 to-amber-600/5', icon: 'text-amber-400', glow: 'shadow-amber-500/10' },
    red: { bg: 'from-red-500/20 to-red-600/5', icon: 'text-red-400', glow: 'shadow-red-500/10' },
    pink: { bg: 'from-pink-500/20 to-pink-600/5', icon: 'text-pink-400', glow: 'shadow-pink-500/10' },
  };

  const c = colorMap[color] || colorMap.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={`glass p-5 hover:bg-white/[0.08] transition-all duration-300 shadow-lg ${c.glow}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/40'
          }`}>
            {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{typeof value === 'number' ? formatCurrency(value) : value}</p>
    </motion.div>
  );
}
