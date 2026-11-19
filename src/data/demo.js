import { subDays, subMonths, format, addDays } from 'date-fns';

// ── Demo User ──
export const demoUser = {
  id: 'demo-user-001',
  email: 'demo@livepulse.app',
  full_name: 'Arjun Mehta',
  avatar_url: null,
  currency: 'INR',
  created_at: '2024-01-15T10:00:00Z',
};

// ── Admin User ──
export const adminUser = {
  id: 'admin-user-001',
  email: 'admin@livepulse.app',
  full_name: 'System Administrator',
  avatar_url: null,
  currency: 'INR',
  created_at: '2023-01-01T00:00:00Z',
  role: 'admin',
};

// ── Categories ──
export const demoCategories = [
  { id: 'cat-1', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#8b5cf6' },
  { id: 'cat-2', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { id: 'cat-3', name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#10b981' },
  { id: 'cat-4', name: 'Gifts', type: 'income', icon: 'Gift', color: '#ec4899' },
  { id: 'cat-5', name: 'Food & Dining', type: 'expense', icon: 'UtensilsCrossed', color: '#f59e0b' },
  { id: 'cat-6', name: 'Transport', type: 'expense', icon: 'Car', color: '#06b6d4' },
  { id: 'cat-7', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { id: 'cat-8', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#8b5cf6' },
  { id: 'cat-9', name: 'Bills & Utilities', type: 'expense', icon: 'Zap', color: '#ef4444' },
  { id: 'cat-10', name: 'Rent', type: 'expense', icon: 'Home', color: '#f97316' },
  { id: 'cat-11', name: 'Healthcare', type: 'expense', icon: 'Heart', color: '#10b981' },
  { id: 'cat-12', name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#3b82f6' },
  { id: 'cat-13', name: 'Travel', type: 'expense', icon: 'Plane', color: '#14b8a6' },
  { id: 'cat-14', name: 'Subscriptions', type: 'expense', icon: 'CreditCard', color: '#a855f7' },
  { id: 'cat-15', name: 'Groceries', type: 'expense', icon: 'ShoppingCart', color: '#22c55e' },
];

// ── Helper to generate dates ──
const today = new Date();
const d = (daysAgo) => format(subDays(today, daysAgo), 'yyyy-MM-dd');
const dm = (monthsAgo, day) => {
  const m = subMonths(today, monthsAgo);
  return format(new Date(m.getFullYear(), m.getMonth(), day), 'yyyy-MM-dd');
};

// ── Demo User Transactions (Personal portfolio - Arjun Mehta) ──
export const demoTransactions = [
  // Current month
  { id: 't-001', type: 'income', category: 'Salary', amount: 85000, description: 'Monthly salary - November', date: d(2), account: 'HDFC Bank' },
  { id: 't-002', type: 'expense', category: 'Rent', amount: 22000, description: 'Monthly rent', date: d(1), account: 'HDFC Bank' },
  { id: 't-003', type: 'expense', category: 'Groceries', amount: 3200, description: 'BigBasket weekly order', date: d(1), account: 'ICICI Card' },
  { id: 't-004', type: 'expense', category: 'Food & Dining', amount: 850, description: 'Swiggy dinner', date: d(2), account: 'Paytm' },
  { id: 't-005', type: 'expense', category: 'Transport', amount: 450, description: 'Uber to office', date: d(3), account: 'UPI' },
  { id: 't-006', type: 'income', category: 'Freelance', amount: 15000, description: 'Logo design project', date: d(4), account: 'PayPal' },
  { id: 't-007', type: 'expense', category: 'Subscriptions', amount: 999, description: 'Netflix monthly', date: d(5), account: 'ICICI Card' },
  { id: 't-008', type: 'expense', category: 'Shopping', amount: 4500, description: 'Amazon - headphones', date: d(6), account: 'Amazon Pay' },
  { id: 't-009', type: 'expense', category: 'Bills & Utilities', amount: 2800, description: 'Electricity bill', date: d(7), account: 'HDFC Bank' },
  { id: 't-010', type: 'expense', category: 'Food & Dining', amount: 1200, description: 'Restaurant lunch with team', date: d(8), account: 'UPI' },
  { id: 't-011', type: 'expense', category: 'Entertainment', amount: 600, description: 'Movie tickets - PVR', date: d(9), account: 'Paytm' },
  { id: 't-012', type: 'expense', category: 'Healthcare', amount: 1500, description: 'Doctor consultation', date: d(10), account: 'UPI' },
  { id: 't-013', type: 'expense', category: 'Transport', amount: 300, description: 'Metro recharge', date: d(11), account: 'UPI' },
  { id: 't-014', type: 'expense', category: 'Groceries', amount: 2800, description: 'Zepto groceries', date: d(12), account: 'ICICI Card' },
  { id: 't-015', type: 'expense', category: 'Food & Dining', amount: 550, description: 'Zomato lunch', date: d(13), account: 'UPI' },
  { id: 't-016', type: 'expense', category: 'Education', amount: 3500, description: 'Udemy courses', date: d(14), account: 'ICICI Card' },

  // 1 month ago
  { id: 't-017', type: 'income', category: 'Salary', amount: 85000, description: 'Monthly salary - October', date: dm(1, 1), account: 'HDFC Bank' },
  { id: 't-018', type: 'income', category: 'Freelance', amount: 25000, description: 'Web development project', date: dm(1, 10), account: 'PayPal' },
  { id: 't-019', type: 'expense', category: 'Rent', amount: 22000, description: 'Monthly rent', date: dm(1, 2), account: 'HDFC Bank' },
  { id: 't-020', type: 'expense', category: 'Groceries', amount: 6500, description: 'Monthly groceries', date: dm(1, 5), account: 'ICICI Card' },
  { id: 't-021', type: 'expense', category: 'Food & Dining', amount: 4200, description: 'Dining out', date: dm(1, 8), account: 'UPI' },
  { id: 't-022', type: 'expense', category: 'Shopping', amount: 8900, description: 'Myntra clothing', date: dm(1, 12), account: 'ICICI Card' },
  { id: 't-023', type: 'expense', category: 'Bills & Utilities', amount: 4500, description: 'Phone + Internet bills', date: dm(1, 15), account: 'HDFC Bank' },
  { id: 't-024', type: 'expense', category: 'Transport', amount: 2200, description: 'Uber rides', date: dm(1, 18), account: 'UPI' },
  { id: 't-025', type: 'expense', category: 'Entertainment', amount: 1500, description: 'Concert tickets', date: dm(1, 20), account: 'Paytm' },
  { id: 't-026', type: 'expense', category: 'Subscriptions', amount: 2500, description: 'Spotify + YouTube Premium', date: dm(1, 22), account: 'ICICI Card' },
  { id: 't-027', type: 'expense', category: 'Healthcare', amount: 3200, description: 'Pharmacy + checkup', date: dm(1, 25), account: 'UPI' },

  // 2 months ago
  { id: 't-028', type: 'income', category: 'Salary', amount: 82000, description: 'Monthly salary - September', date: dm(2, 1), account: 'HDFC Bank' },
  { id: 't-029', type: 'income', category: 'Investments', amount: 12000, description: 'Mutual fund dividend', date: dm(2, 15), account: 'Zerodha' },
  { id: 't-030', type: 'expense', category: 'Rent', amount: 22000, description: 'Monthly rent', date: dm(2, 2), account: 'HDFC Bank' },
  { id: 't-031', type: 'expense', category: 'Travel', amount: 15000, description: 'Goa trip flights', date: dm(2, 10), account: 'ICICI Card' },
  { id: 't-032', type: 'expense', category: 'Food & Dining', amount: 5500, description: 'Dining expenses', date: dm(2, 12), account: 'UPI' },
  { id: 't-033', type: 'expense', category: 'Shopping', amount: 6200, description: 'Electronics', date: dm(2, 16), account: 'Amazon Pay' },
  { id: 't-034', type: 'expense', category: 'Groceries', amount: 5800, description: 'Monthly groceries', date: dm(2, 8), account: 'ICICI Card' },
  { id: 't-035', type: 'expense', category: 'Bills & Utilities', amount: 3800, description: 'All utility bills', date: dm(2, 20), account: 'HDFC Bank' },

  // 3 months ago
  { id: 't-036', type: 'income', category: 'Salary', amount: 82000, description: 'Monthly salary - August', date: dm(3, 1), account: 'HDFC Bank' },
  { id: 't-037', type: 'income', category: 'Freelance', amount: 18000, description: 'UI design project', date: dm(3, 20), account: 'PayPal' },
  { id: 't-038', type: 'expense', category: 'Rent', amount: 22000, description: 'Monthly rent', date: dm(3, 2), account: 'HDFC Bank' },
  { id: 't-039', type: 'expense', category: 'Education', amount: 12000, description: 'Online certification', date: dm(3, 5), account: 'ICICI Card' },
  { id: 't-040', type: 'expense', category: 'Food & Dining', amount: 4800, description: 'Dining out', date: dm(3, 10), account: 'UPI' },
  { id: 't-041', type: 'expense', category: 'Shopping', amount: 3500, description: 'Books & supplies', date: dm(3, 15), account: 'Amazon Pay' },
  { id: 't-042', type: 'expense', category: 'Transport', amount: 1800, description: 'Monthly commute', date: dm(3, 18), account: 'UPI' },
  { id: 't-043', type: 'expense', category: 'Groceries', amount: 5200, description: 'Monthly groceries', date: dm(3, 7), account: 'ICICI Card' },
  { id: 't-044', type: 'expense', category: 'Bills & Utilities', amount: 3200, description: 'Bills', date: dm(3, 22), account: 'HDFC Bank' },

  // 4 months ago
  { id: 't-045', type: 'income', category: 'Salary', amount: 80000, description: 'Monthly salary - July', date: dm(4, 1), account: 'HDFC Bank' },
  { id: 't-046', type: 'income', category: 'Gifts', amount: 10000, description: 'Birthday gift', date: dm(4, 15), account: 'UPI' },
  { id: 't-047', type: 'expense', category: 'Rent', amount: 22000, description: 'Monthly rent', date: dm(4, 2), account: 'HDFC Bank' },
  { id: 't-048', type: 'expense', category: 'Food & Dining', amount: 5200, description: 'Birthday celebration dinner', date: dm(4, 15), account: 'ICICI Card' },
  { id: 't-049', type: 'expense', category: 'Shopping', amount: 15000, description: 'Birthday shopping', date: dm(4, 14), account: 'Amazon Pay' },
  { id: 't-050', type: 'expense', category: 'Groceries', amount: 4800, description: 'Monthly groceries', date: dm(4, 6), account: 'ICICI Card' },
  { id: 't-051', type: 'expense', category: 'Entertainment', amount: 2500, description: 'Gaming subscription', date: dm(4, 20), account: 'ICICI Card' },
  { id: 't-052', type: 'expense', category: 'Bills & Utilities', amount: 3500, description: 'Bills', date: dm(4, 18), account: 'HDFC Bank' },

  // 5 months ago
  { id: 't-053', type: 'income', category: 'Salary', amount: 80000, description: 'Monthly salary - June', date: dm(5, 1), account: 'HDFC Bank' },
  { id: 't-054', type: 'income', category: 'Freelance', amount: 20000, description: 'App design project', date: dm(5, 12), account: 'PayPal' },
  { id: 't-055', type: 'expense', category: 'Rent', amount: 20000, description: 'Monthly rent', date: dm(5, 2), account: 'HDFC Bank' },
  { id: 't-056', type: 'expense', category: 'Food & Dining', amount: 3800, description: 'Dining expenses', date: dm(5, 10), account: 'UPI' },
  { id: 't-057', type: 'expense', category: 'Travel', amount: 25000, description: 'Manali trip', date: dm(5, 18), account: 'ICICI Card' },
  { id: 't-058', type: 'expense', category: 'Groceries', amount: 4500, description: 'Monthly groceries', date: dm(5, 5), account: 'ICICI Card' },
  { id: 't-059', type: 'expense', category: 'Shopping', amount: 3200, description: 'Summer clothing', date: dm(5, 22), account: 'Myntra' },
  { id: 't-060', type: 'expense', category: 'Bills & Utilities', amount: 4200, description: 'AC electricity spike', date: dm(5, 25), account: 'HDFC Bank' },
];

// ── Admin Specific Transactions (Enterprise / Organization scale) ──
export const adminTransactions = [
  { id: 'adm-1', type: 'income', category: 'Investments', amount: 450000, description: 'Enterprise SaaS Annual Contract', date: d(1), account: 'Corporate ICICI' },
  { id: 'adm-2', type: 'income', category: 'Salary', amount: 250000, description: 'Director Executive Compensation', date: d(2), account: 'Corporate HDFC' },
  { id: 'adm-3', type: 'income', category: 'Freelance', amount: 120000, description: 'System Architecture Consulting', date: d(3), account: 'Stripe' },
  { id: 'adm-4', type: 'expense', category: 'Bills & Utilities', amount: 45000, description: 'AWS & Supabase Cloud Cluster', date: d(4), account: 'Corporate Amex' },
  { id: 'adm-5', type: 'expense', category: 'Rent', amount: 85000, description: 'Tech Park Office Lease', date: d(5), account: 'Corporate HDFC' },
  { id: 'adm-6', type: 'expense', category: 'Education', amount: 35000, description: 'Engineering Team Certifications', date: d(6), account: 'Corporate ICICI' },
  { id: 'adm-7', type: 'expense', category: 'Travel', amount: 65000, description: 'Client Summit Bangalore Flight & Hotel', date: d(8), account: 'Corporate Amex' },
  { id: 'adm-8', type: 'expense', category: 'Subscriptions', amount: 28000, description: 'GitHub Enterprise & Figma Org', date: d(10), account: 'Corporate Amex' },
  { id: 'adm-9', type: 'expense', category: 'Food & Dining', amount: 18000, description: 'Quarterly Team Dinner', date: d(12), account: 'Corporate HDFC' },
  { id: 'adm-10', type: 'income', category: 'Investments', amount: 180000, description: 'Angel Syndicate Distribution', date: dm(1, 15), account: 'Zerodha' },
  { id: 'adm-11', type: 'expense', category: 'Bills & Utilities', amount: 42000, description: 'Cloud Infrastructure & CDN', date: dm(1, 20), account: 'Corporate Amex' },
  { id: 'adm-12', type: 'income', category: 'Investments', amount: 420000, description: 'Enterprise Retainer Q3', date: dm(2, 5), account: 'Corporate ICICI' },
];

// ── Budgets (current month) ──
export const demoBudgets = [
  { id: 'b-1', category: 'Food & Dining', limit: 8000, period: 'monthly', color: '#f59e0b' },
  { id: 'b-2', category: 'Transport', limit: 3000, period: 'monthly', color: '#06b6d4' },
  { id: 'b-3', category: 'Shopping', limit: 10000, period: 'monthly', color: '#ec4899' },
  { id: 'b-4', category: 'Entertainment', limit: 3000, period: 'monthly', color: '#8b5cf6' },
  { id: 'b-5', category: 'Groceries', limit: 7000, period: 'monthly', color: '#22c55e' },
  { id: 'b-6', category: 'Bills & Utilities', limit: 5000, period: 'monthly', color: '#ef4444' },
  { id: 'b-7', category: 'Subscriptions', limit: 3000, period: 'monthly', color: '#a855f7' },
  { id: 'b-8', category: 'Healthcare', limit: 5000, period: 'monthly', color: '#10b981' },
  { id: 'b-9', category: 'Education', limit: 5000, period: 'monthly', color: '#3b82f6' },
  { id: 'b-10', category: 'Travel', limit: 15000, period: 'monthly', color: '#14b8a6' },
];

// ── Admin Budgets ──
export const adminBudgets = [
  { id: 'ab-1', category: 'Bills & Utilities', limit: 60000, period: 'monthly', color: '#ef4444' },
  { id: 'ab-2', category: 'Rent', limit: 100000, period: 'monthly', color: '#f97316' },
  { id: 'ab-3', category: 'Subscriptions', limit: 40000, period: 'monthly', color: '#a855f7' },
  { id: 'ab-4', category: 'Travel', limit: 80000, period: 'monthly', color: '#14b8a6' },
  { id: 'ab-5', category: 'Education', limit: 50000, period: 'monthly', color: '#3b82f6' },
];

// ── Savings Goals ──
export const demoSavingsGoals = [
  { id: 'sg-1', name: 'Emergency Fund', target: 300000, saved: 185000, icon: 'Shield', color: '#10b981', deadline: '2027-06-30' },
  { id: 'sg-2', name: 'MacBook Pro', target: 200000, saved: 72000, icon: 'Laptop', color: '#8b5cf6', deadline: '2027-03-15' },
  { id: 'sg-3', name: 'Europe Trip', target: 500000, saved: 125000, icon: 'Plane', color: '#06b6d4', deadline: '2027-12-01' },
  { id: 'sg-4', name: 'New Bike', target: 150000, saved: 150000, icon: 'Bike', color: '#f59e0b', deadline: '2026-12-31' },
  { id: 'sg-5', name: 'Investment Portfolio', target: 1000000, saved: 340000, icon: 'TrendingUp', color: '#ec4899', deadline: '2028-01-01' },
];

// ── Admin Goals ──
export const adminSavingsGoals = [
  { id: 'asg-1', name: 'Corporate Reserve', target: 2500000, saved: 1750000, icon: 'Shield', color: '#10b981', deadline: '2027-12-31' },
  { id: 'asg-2', name: 'Server Hardware Refresh', target: 800000, saved: 520000, icon: 'Laptop', color: '#8b5cf6', deadline: '2027-06-30' },
  { id: 'asg-3', name: 'Expansion Fund', target: 5000000, saved: 2100000, icon: 'TrendingUp', color: '#06b6d4', deadline: '2028-12-31' },
];

// ── Notifications ──
export const demoNotifications = [
  { id: 'n-1', type: 'warning', title: 'Budget Alert', message: 'Food & Dining spending is at 82% of your monthly budget.', read: false, created_at: d(0) },
  { id: 'n-2', type: 'success', title: 'Goal Achieved! 🎉', message: 'Congratulations! You\'ve completed your "New Bike" savings goal.', read: false, created_at: d(1) },
  { id: 'n-3', type: 'info', title: 'Income Received', message: 'Salary of ₹85,000 credited to your HDFC Bank account.', read: false, created_at: d(2) },
  { id: 'n-4', type: 'warning', title: 'Large Expense', message: 'Shopping expense of ₹4,500 detected. This is above your daily average.', read: true, created_at: d(6) },
  { id: 'n-5', type: 'info', title: 'Monthly Report Ready', message: 'Your October financial report is now available. Net savings: ₹29,500.', read: true, created_at: d(15) },
  { id: 'n-6', type: 'success', title: 'Budget On Track', message: 'Transport spending is well within your budget this month.', read: true, created_at: d(18) },
  { id: 'n-7', type: 'error', title: 'Budget Exceeded', message: 'Shopping has exceeded the monthly budget by ₹2,400.', read: true, created_at: d(20) },
];

// ── Chart Colors ──
export const CHART_COLORS = [
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899',
  '#ef4444', '#3b82f6', '#14b8a6', '#a855f7', '#f97316',
  '#22c55e', '#e879f9', '#fb923c', '#2dd4bf', '#818cf8',
];
