import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, FileSpreadsheet, Calendar, TrendingUp,
  TrendingDown, ArrowUpRight, ArrowDownRight, Printer,
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useTransactions } from '../hooks/useTransactions';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function Reports() {
  const { transactions, monthlyTrend } = useTransactions();

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(monthlyTrend.length - 1);
  const currentReport = monthlyTrend[selectedMonthIndex] || monthlyTrend[monthlyTrend.length - 1];

  // Calculate savings rate
  const savingsRate =
    currentReport.income > 0 ? (currentReport.savings / currentReport.income) * 100 : 0;

  // Export CSV of monthly statements
  const handleExportCSV = () => {
    const data = monthlyTrend.map((m) => ({
      Month: m.fullMonth,
      Income: m.income,
      Expenses: m.expenses,
      NetSavings: m.savings,
      SavingsRate: m.income > 0 ? `${Math.round((m.savings / m.income) * 100)}%` : '0%',
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `financial_report_${currentReport.month}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Excel
  const handleExportExcel = () => {
    const data = monthlyTrend.map((m) => ({
      Month: m.fullMonth,
      Income: m.income,
      Expenses: m.expenses,
      NetSavings: m.savings,
      SavingsRate: m.income > 0 ? `${Math.round((m.savings / m.income) * 100)}%` : '0%',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Summary');
    XLSX.writeFile(wb, `financial_report_${currentReport.month}.xlsx`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial Reports</h1>
          <p className="text-sm text-white/50 mt-1">
            Audited financial statements and executive exportable summaries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="secondary" size="sm" icon={FileSpreadsheet} onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
            Print / PDF
          </Button>
        </div>
      </div>

      {/* ── Month Selector ── */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-medium text-white/40 mr-2 uppercase tracking-wider flex-shrink-0">
            Select Statement:
          </span>
          {monthlyTrend.map((m, idx) => (
            <button
              key={m.fullMonth}
              onClick={() => setSelectedMonthIndex(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                selectedMonthIndex === idx
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-500/30 shadow-md'
                  : 'glass text-white/50 hover:text-white'
              }`}
            >
              {m.fullMonth}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* ── Statement Card Header ── */}
      <GlassCard className="p-6 md:p-8 bg-gradient-to-br from-navy-900/90 to-navy-800/90 border border-purple-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              Official Statement
            </span>
            <h2 className="text-2xl font-bold text-white mt-2">
              Financial Performance: {currentReport.fullMonth}
            </h2>
            <p className="text-xs text-white/40 mt-1">
              Generated automatically by LivePulse Engine
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">Statement Currency</p>
            <p className="text-lg font-bold text-white">INR (₹)</p>
          </div>
        </div>

        {/* 4 Summary Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-white/[0.08]">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Gross Inflow</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {formatCurrency(currentReport.income)}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Total Expenses</p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              {formatCurrency(currentReport.expenses)}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Net Cash Retained</p>
            <p className="text-2xl font-bold text-white mt-1">
              {formatCurrency(currentReport.savings)}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">Net Savings Rate</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {formatPercent(savingsRate)}
            </p>
          </div>
        </div>

        {/* Notes / Assessment */}
        <div className="pt-6">
          <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
            Executive Summary
          </h4>
          <p className="text-sm text-white/60 leading-relaxed">
            During {currentReport.fullMonth}, total recorded inflows were {formatCurrency(currentReport.income)} against total expenditures of {formatCurrency(currentReport.expenses)}, generating a net surplus of {formatCurrency(currentReport.savings)}. Your savings rate stands at {formatPercent(savingsRate)}, which satisfies your personal threshold of 20%.
          </p>
        </div>
      </GlassCard>

      {/* ── Full Year Breakdown Table ── */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-5 border-b border-white/[0.06]">
          <h3 className="text-base font-semibold text-white">Annual Audited Overview</h3>
          <p className="text-xs text-white/40">Aggregated performance across all recorded cycles</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-xs font-medium text-white/40 uppercase tracking-wider bg-white/[0.02]">
                <th className="py-3 px-6">Period</th>
                <th className="py-3 px-6 text-right">Inflow</th>
                <th className="py-3 px-6 text-right">Outflow</th>
                <th className="py-3 px-6 text-right">Surplus / Deficit</th>
                <th className="py-3 px-6 text-right">Retention %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {monthlyTrend.map((m) => {
                const rate = m.income > 0 ? (m.savings / m.income) * 100 : 0;
                return (
                  <tr key={m.month} className="hover:bg-white/[0.03] transition-colors text-sm">
                    <td className="py-3.5 px-6 font-medium text-white/90">{m.fullMonth}</td>
                    <td className="py-3.5 px-6 text-right text-emerald-400">{formatCurrency(m.income)}</td>
                    <td className="py-3.5 px-6 text-right text-red-400">{formatCurrency(m.expenses)}</td>
                    <td className="py-3.5 px-6 text-right text-white font-semibold">{formatCurrency(m.savings)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <Badge variant={rate >= 25 ? 'green' : rate > 0 ? 'purple' : 'red'}>
                        {formatPercent(rate)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
