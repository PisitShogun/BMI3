'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BMICalculator from '@/components/BMICalculator';
import HistoryList from '@/components/HistoryList';
import Link from 'next/link';

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">BMI Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/reports" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Reports
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BMICalculator onCalculate={() => setRefreshTrigger(prev => prev + 1)} />
            <HistoryList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
}
