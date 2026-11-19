import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, glow = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`
        glass p-6 
        ${hover ? 'hover:bg-white/[0.08] transition-all duration-300' : ''}
        ${glow === 'purple' ? 'glow-purple' : glow === 'cyan' ? 'glow-cyan' : glow === 'green' ? 'glow-green' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
