import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, timeAgo } from '../../utils/formatters';

export default function RecentTransactions({ transactions }) {
  const recent = (transactions || []).slice(0, 8);

  if (recent.length === 0) {
    return (
      <div className="py-8 text-center flex flex-col items-center justify-center">
        <p className="text-sm text-white/40 mb-3">No transactions recorded yet</p>
        <Link
          to="/add-transaction"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 glass px-3 py-1.5 rounded-lg transition-colors"
        >
          <PlusCircle size={14} /> Add your first transaction
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recent.map((txn, i) => (
        <motion.div
          key={txn.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            txn.type === 'income'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {txn.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white/85 truncate">{txn.description}</p>
            <p className="text-xs text-white/35">{txn.category} · {timeAgo(txn.date)}</p>
          </div>

          <span className={`text-sm font-semibold ${
            txn.type === 'income' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
