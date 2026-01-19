'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type StatItem = {
  period: string;
  count: number;
  avgBmi: number;
  minBmi: number;
  maxBmi: number;
};

type Summary = {
  totalRecords: number;
  overallAvgBmi: number;
};

export default function ReportsPage() {
  const [period, setPeriod] = useState('daily');
  const [stats, setStats] = useState<StatItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports/stats?period=${period}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">MIS Reports</h1>
            </div>
            <div className="flex items-center">
              <Link 
                href="/dashboard" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 space-y-6">
          
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Records</div>
                <div className="text-3xl font-bold">{summary.totalRecords}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400">Overall Average BMI</div>
                <div className="text-3xl font-bold">{summary.overallAvgBmi || '-'}</div>
              </div>
            </div>
          )}

          {/* Period Selector */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex space-x-2 overflow-x-auto">
              {periods.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    period === p.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Historical Data ({period})</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading data...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Avg BMI</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Min / Max</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.map((item) => (
                      <tr key={item.period} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                          <span className={
                            item.avgBmi < 18.5 ? 'text-yellow-600' :
                            item.avgBmi < 25 ? 'text-green-600' :
                            item.avgBmi < 30 ? 'text-orange-600' : 'text-red-600'
                          }>
                            {item.avgBmi}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.minBmi} - {item.maxBmi}
                        </td>
                      </tr>
                    ))}
                    {stats.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No data found for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
