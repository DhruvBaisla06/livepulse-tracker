import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export default function BudgetProgress({ budgets }) {
  return (
    <div className="space-y-4">
      {budgets.slice(0, 5).map((budget, i) => (
        <motion.div
          key={budget.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70 font-medium">{budget.category}</span>
            <span className={`font-semibold ${
              budget.status === 'exceeded' ? 'text-red-400' :
              budget.status === 'warning' ? 'text-amber-400' :
              'text-emerald-400'
            }`}>
              {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budget.percent, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
              className={`h-full rounded-full ${
                budget.status === 'exceeded' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                budget.status === 'warning' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                'bg-gradient-to-r from-purple-500 to-cyan-400'
              }`}
            />
          </div>
          <div className="flex justify-between text-xs text-white/30">
            <span>{formatPercent(budget.percent)} used</span>
            <span>{formatCurrency(budget.remaining)} left</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
