'use client';

import { useState } from 'react';

type BMIResult = {
  bmi: number;
  status: string;
  color: string;
};

export default function BMICalculator({ onCalculate }: { onCalculate: () => void }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const interpretBMI = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-yellow-500' };
    if (bmi < 25) return { status: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-orange-500' };
    return { status: 'Obesity', color: 'text-red-500' };
  };

  const calculateBMI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(weight),
          height: parseFloat(height),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const interpretation = interpretBMI(data.bmi);
        setResult({
          bmi: data.bmi,
          ...interpretation,
        });
        onCalculate(); // Refresh history
      }
    } catch (error) {
      console.error('Calculation failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Calculate BMI</h2>
      <form onSubmit={calculateBMI} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            step="0.1"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="e.g. 70"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
            step="0.1"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="e.g. 175"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-center">
          <div className="text-gray-500 dark:text-gray-300">Your BMI is</div>
          <div className="text-4xl font-bold my-2">{result.bmi}</div>
          <div className={`text-xl font-semibold ${result.color}`}>
            {result.status}
          </div>
        </div>
      )}
    </div>
  );
}
