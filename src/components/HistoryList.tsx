'use client';

import { useEffect, useState } from 'react';

type Record = {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  created_at: string;
};

export default function HistoryList({ refreshTrigger }: { refreshTrigger: number }) {
  const [history, setHistory] = useState<Record[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/bmi/history');
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error('Failed to fetch history', error);
      }
    };

    fetchHistory();
  }, [refreshTrigger]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Recent History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="pb-3">Date</th>
              <th className="pb-3">BMI</th>
              <th className="pb-3">Weight</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id} className="border-b dark:border-gray-700 last:border-0">
                <td className="py-3">
                  {new Date(record.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 font-semibold">{record.bmi}</td>
                <td className="py-3 text-gray-500">{record.weight} kg</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No records yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
