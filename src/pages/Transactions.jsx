import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Download, Trash2, Edit, ArrowUpRight, ArrowDownRight,
  Filter, Calendar, FileSpreadsheet, Check, X,
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useTransactions } from '../hooks/useTransactions';
import { demoCategories } from '../data/demo';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Transactions() {
  const { transactions, deleteTransaction, updateTransaction } = useTransactions();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [editingTxn, setEditingTxn] = useState(null);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.account && t.account.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = selectedType === 'all' || t.type === selectedType;
      const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;

      return matchSearch && matchType && matchCategory;
    });
  }, [transactions, searchTerm, selectedType, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  // Export to CSV
  const handleExportCSV = () => {
    const dataToExport = filtered.map((t) => ({
      ID: t.id,
      Date: t.date,
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Description: t.description,
      Account: t.account || '',
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `livepulse_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const dataToExport = filtered.map((t) => ({
      ID: t.id,
      Date: t.date,
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Description: t.description,
      Account: t.account || '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, `livepulse_transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editingTxn) return;
    updateTransaction(editingTxn.id, {
      description: editingTxn.description,
      amount: Number(editingTxn.amount),
      category: editingTxn.category,
      type: editingTxn.type,
      date: editingTxn.date,
      account: editingTxn.account,
    });
    setEditingTxn(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-sm text-white/50 mt-1">
            Manage, filter, and audit all financial activities ({transactions.length} records)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCSV}>
            CSV
          </Button>
          <Button variant="secondary" size="sm" icon={FileSpreadsheet} onClick={handleExportExcel}>
            Excel
          </Button>
          <Link to="/add-transaction">
            <Button variant="primary" size="sm" icon={Plus}>
              Add Transaction
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search description, account..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full glass pl-9 pr-3 py-2 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="w-full glass px-3 py-2 text-sm text-white/90 bg-navy-900 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full glass px-3 py-2 text-sm text-white/90 bg-navy-900 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          >
            <option value="all">All Categories</option>
            {demoCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {(searchTerm || selectedType !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedCategory('all');
                setPage(1);
              }}
              className="px-3 py-2 text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-1"
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>
      </GlassCard>

      {/* ── Transaction Table (Desktop) / Cards (Mobile) ── */}
      <GlassCard className="p-0 overflow-hidden">
        {paginated.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs font-medium text-white/40 uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-3.5 px-4 sm:px-6">Transaction</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Account</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {paginated.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            txn.type === 'income'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-red-500/15 text-red-400'
                          }`}
                        >
                          {txn.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/90">{txn.description}</p>
                          <p className="text-xs text-white/30 sm:hidden">{txn.category} · {txn.date}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <Badge variant="purple">{txn.category}</Badge>
                    </td>

                    <td className="py-3.5 px-4 text-sm text-white/60 hidden sm:table-cell">
                      {formatDate(txn.date)}
                    </td>

                    <td className="py-3.5 px-4 text-sm text-white/50 hidden md:table-cell">
                      {txn.account || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          txn.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {txn.type === 'income' ? '+' : '-'}
                        {formatCurrency(txn.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTxn(txn)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteModalId(txn.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your search criteria or add your first transaction."
            action={
              <Link to="/add-transaction">
                <Button variant="primary" icon={Plus}>
                  Add Transaction
                </Button>
              </Link>
            }
          />
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/[0.06] text-xs text-white/50">
            <span>
              Showing {(page - 1) * itemsPerPage + 1} to{' '}
              {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        isOpen={!!deleteModalId}
        onClose={() => setDeleteModalId(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <p className="text-sm text-white/70 mb-6">
          Are you sure you want to delete this transaction? This action will immediately recalculate all your financial totals.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteModalId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteTransaction(deleteModalId);
              setDeleteModalId(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* ── Edit Transaction Modal ── */}
      {editingTxn && (
        <Modal
          isOpen={!!editingTxn}
          onClose={() => setEditingTxn(null)}
          title="Edit Transaction"
          size="md"
        >
          <form onSubmit={handleEditSave} className="space-y-4">
            <Input
              label="Description"
              value={editingTxn.description}
              onChange={(e) => setEditingTxn({ ...editingTxn, description: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Amount (₹)"
                type="number"
                value={editingTxn.amount}
                onChange={(e) => setEditingTxn({ ...editingTxn, amount: e.target.value })}
                required
              />
              <Input
                label="Date"
                type="date"
                value={editingTxn.date}
                onChange={(e) => setEditingTxn({ ...editingTxn, date: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Category</label>
                <select
                  value={editingTxn.category}
                  onChange={(e) => setEditingTxn({ ...editingTxn, category: e.target.value })}
                  className="w-full glass px-3 py-2 text-sm text-white/90 bg-navy-900 border border-white/10 rounded-xl"
                >
                  {demoCategories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Account"
                value={editingTxn.account || ''}
                onChange={(e) => setEditingTxn({ ...editingTxn, account: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" type="button" onClick={() => setEditingTxn(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
