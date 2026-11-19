import { Menu, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import { motion } from 'framer-motion';

export default function TopBar({ onMenuToggle }) {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16 border-b border-white/[0.06] backdrop-blur-xl bg-navy-950/40">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-white/60 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-2 glass px-3 py-2 rounded-xl min-w-[260px]">
          <Search size={16} className="text-white/30" />
          <input
            type="text"
            placeholder="Search transactions, categories..."
            className="bg-transparent text-sm text-white/80 placeholder-white/30 outline-none flex-1"
          />
          <kbd className="hidden lg:inline text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          Live
        </span>

        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl hover:bg-white/5 text-white/60 transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 bg-purple-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}
