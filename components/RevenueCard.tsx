import React, { useState, useMemo } from 'react';
import { RevenueData, Transaction } from '../types';
import BarChart from './BarChart';

interface RevenueCardProps {
    data: RevenueData;
    transactions: Transaction[];
    selectedDate: Date;
}

type Period = 'today' | 'week' | 'month' | 'ytd' | 'mcv' | 'acv';

const RevenueButton: React.FC<{
    label: string;
    value: string;
    period: Period;
    activePeriod: Period | null;
    onClick: (period: Period) => void;
}> = ({ label, value, period, activePeriod, onClick }) => (
    <div className="flex items-center justify-between">
        <button 
            onClick={() => onClick(period)}
            className={`text-sm font-medium text-left flex items-center rounded px-2 py-1 transition-colors w-1/3 ${
                activePeriod === period
                    ? 'bg-brand-blue text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-gray/50'
            }`}
        >
            <span className="text-brand-red mr-2">•</span> {label}
        </button>
        <p 
            className="w-2/3 bg-brand-light-bg dark:bg-brand-gray/50 border border-brand-light-border dark:border-brand-gray rounded-md px-2 py-1 text-sm text-brand-light-text dark:text-white text-right font-semibold"
        >
            {value || '$0.00'}
        </p>
    </div>
);

const RevenueCard: React.FC<RevenueCardProps> = ({ data, transactions, selectedDate }) => {
    const [activePeriod, setActivePeriod] = useState<Period | null>(null);

    const handlePeriodClick = (period: Period) => {
        setActivePeriod(prev => prev === period ? null : period);
    };

    const chartData = useMemo(() => {
        if (!activePeriod) return [];

        const getDateKey = (date: Date): string => date.toISOString().split('T')[0];

        let filteredTransactions: Transaction[] = [];

        if (activePeriod === 'mcv' || activePeriod === 'acv') {
             filteredTransactions = transactions.filter(t => t.isRecurring);
        } else {
            const todayKey = getDateKey(selectedDate);

            if (activePeriod === 'today') {
                filteredTransactions = transactions.filter(t => t.date === todayKey);
            } else if (activePeriod === 'week') {
                const startOfWeek = new Date(selectedDate);
                startOfWeek.setDate(startOfWeek.getDate() - selectedDate.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                const startKey = getDateKey(startOfWeek);
                const endKey = getDateKey(endOfWeek);
                filteredTransactions = transactions.filter(t => t.date >= startKey && t.date <= endKey);
            } else if (activePeriod === 'month') {
                const currentMonth = selectedDate.getMonth();
                const currentYear = selectedDate.getFullYear();
                filteredTransactions = transactions.filter(t => {
                    const tDate = new Date(t.date + 'T00:00:00');
                    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
                });
            } else if (activePeriod === 'ytd') {
                const currentYear = selectedDate.getFullYear();
                 filteredTransactions = transactions.filter(t => {
                    const tDate = new Date(t.date + 'T00:00:00');
                    return tDate.getFullYear() === currentYear;
                });
            }
        }

        const productBreakdown: Record<string, number> = {};
        filteredTransactions.forEach(t => {
            productBreakdown[t.product] = (productBreakdown[t.product] || 0) + t.amount;
        });

        return Object.entries(productBreakdown)
            .map(([name, revenue]) => ({ name, revenue }))
            .sort((a, b) => b.revenue - a.revenue);

    }, [activePeriod, transactions, selectedDate]);


    return (
        <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
            <h3 className="text-lg font-bold mb-4 bg-brand-gray/80 text-white p-2 rounded text-center">REVENUE GENERATED</h3>
            <div className="space-y-3">
                <RevenueButton label="TODAY" value={data.today} period="today" activePeriod={activePeriod} onClick={handlePeriodClick} />
                <RevenueButton label="WEEK" value={data.week} period="week" activePeriod={activePeriod} onClick={handlePeriodClick} />
                <RevenueButton label="MONTH" value={data.month} period="month" activePeriod={activePeriod} onClick={handlePeriodClick} />
                <RevenueButton label="YTD" value={data.ytd} period="ytd" activePeriod={activePeriod} onClick={handlePeriodClick} />
                <RevenueButton label="MCV" value={data.mcv} period="mcv" activePeriod={activePeriod} onClick={handlePeriodClick} />
                <RevenueButton label="ACV" value={data.acv} period="acv" activePeriod={activePeriod} onClick={handlePeriodClick} />
            </div>

            {activePeriod && (
                <div className="mt-4 pt-4 border-t border-dashed border-brand-light-border dark:border-brand-gray">
                     <h4 className="text-sm font-bold text-center text-gray-500 dark:text-gray-400 uppercase mb-3">
                        {activePeriod} Revenue by Product
                     </h4>
                     <BarChart data={chartData} />
                </div>
            )}
        </div>
    );
};

export default RevenueCard;