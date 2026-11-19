import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCheck, Trash2, AlertTriangle, CheckCircle,
  Info, XCircle, Check,
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { timeAgo } from '../utils/formatters';

export default function Notifications() {
  const {
    notifications, unreadCount, markAsRead, markAllAsRead,
    clearNotification, clearAll,
  } = useNotifications();

  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-400" />;
      case 'success':
        return <CheckCircle size={18} className="text-emerald-400" />;
      case 'error':
        return <XCircle size={18} className="text-red-400" />;
      default:
        return <Info size={18} className="text-cyan-400" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="purple">{unreadCount} New</Badge>
            )}
          </div>
          <p className="text-sm text-white/50 mt-1">
            Real-time threshold alerts, goal milestones, and statement announcements
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" icon={Trash2} onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
              filter === f
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'glass text-white/50 hover:text-white'
            }`}
          >
            {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
          </button>
        ))}
      </div>

      {/* ── Notifications List ── */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass p-4 transition-all duration-200 border ${
                  n.read ? 'border-white/[0.06] opacity-75' : 'border-purple-500/30 bg-purple-500/[0.04]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${getBg(
                      n.type
                    )}`}
                  >
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-white/35 flex-shrink-0">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{n.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => clearNotification(n.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                      title="Dismiss"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <GlassCard>
          <EmptyState
            icon={Bell}
            title="All caught up!"
            description="You don't have any notifications at the moment."
          />
        </GlassCard>
      )}
    </div>
  );
}
