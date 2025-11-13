import React, { useState, useMemo } from 'react';
import { DayData, Transaction, CalendarEvent, getInitialDayData, CalendarEventType, formatTime12Hour, View } from '../types';
import AddEventModal from '../components/AddEventModal';
import ActivityListModal from '../components/ActivityListModal';


interface MonthViewPageProps {
  allData: { [key: string]: DayData };
  onDataChange: (dateKey: string, data: DayData) => Promise<void>;
  transactions: Transaction[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  setView: (view: View) => void;
}

const formatCurrency = (value: number) => {
    if (value === 0) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const calculateKpiScore = (dayData: DayData): number => {
    if (!dayData || !dayData.prospectingContacts) return 0;
    const scoreMap = { SW: 3, SA: 10, EP: 5, CB: 2, LM: 1, ST: 1, NA: 1 };
    let score = 0;
    dayData.prospectingContacts.forEach(contact => {
        for (const code in contact.prospecting) {
            if (contact.prospecting[code as keyof typeof scoreMap]) score += scoreMap[code as keyof typeof scoreMap] || 0;
        }
    });
    return score;
};

const eventTypeColors: Record<CalendarEventType, string> = {
    Appointment: 'bg-brand-blue text-white', Meeting: 'bg-purple-600 text-white', Call: 'bg-brand-lime text-brand-ink',
    'Follow-up': 'bg-yellow-500 text-brand-ink', Personal: 'bg-pink-500 text-white', Task: 'bg-brand-gray text-white',
};


const MonthViewPage: React.FC<MonthViewPageProps> = ({ allData, onDataChange, transactions, selectedDate, onDateChange, setView }) => {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState<Date | null>(null);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [activityModalData, setActivityModalData] = useState<{ title: string; events: CalendarEvent[]; day: Date; } | null>(null);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const { monthDays, dailyData } = useMemo(() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const days = [];
        const data: { [key: string]: { kpi: number; revenue: number; events: CalendarEvent[] } } = {};
        let startDay = firstDayOfMonth.getDay();
        for (let i = 0; i < startDay; i++) { const date = new Date(firstDayOfMonth); date.setDate(date.getDate() - (startDay - i)); days.push(date); }
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const date = new Date(year, month, i);
            const dateKey = date.toISOString().split('T')[0];
            const dayData = allData[dateKey] || getInitialDayData();
            const dayRevenue = transactions.filter(t => t.date === dateKey).reduce((sum, t) => sum + t.amount, 0);
            const dayKpi = calculateKpiScore(dayData);
            const dayEvents = (dayData.events || []).filter(a => a.title);
            data[dateKey] = { kpi: dayKpi, revenue: dayRevenue, events: dayEvents };
            days.push(date);
        }
        while(days.length % 7 !== 0){ const date = new Date(lastDayOfMonth); date.setDate(date.getDate() + (days.length - lastDayOfMonth.getDate() - startDay + 1)); days.push(date); }
        return { monthDays: days, dailyData: data };
    }, [selectedDate, allData, transactions]);

    const handleDayClick = (day: Date) => { setModalDate(day); setEditingEvent(null); setIsEventModalOpen(true); };
    const handleGoToDay = (date: Date) => { onDateChange(date); setView('day-view'); setIsEventModalOpen(false); };

    const handleActivityButtonClick = (e: React.MouseEvent, type: CalendarEventType, events: CalendarEvent[], day: Date) => {
        e.stopPropagation();
        setActivityModalData({ title: `${type}s for ${day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`, events, day });
        setIsActivityModalOpen(true);
    };

    const handleEditEventFromActivityModal = (event: CalendarEvent, day: Date) => {
        setIsActivityModalOpen(false);
        setTimeout(() => { setModalDate(day); setEditingEvent(event); setIsEventModalOpen(true); }, 100);
    };
    
    const handleSaveEvent = (eventData: CalendarEvent, originalDateKey: string | null, newDateKey: string) => {
        if (originalDateKey && allData[originalDateKey] && originalDateKey !== newDateKey) {
            const originalDayData = allData[originalDateKey];
            const updatedEvents = originalDayData.events.filter(e => e.id !== eventData.id);
            onDataChange(originalDateKey, { ...originalDayData, events: updatedEvents });
        }

        const newDayData = allData[newDateKey] || getInitialDayData();
        const existingEventIndex = newDayData.events.findIndex(e => e.id === eventData.id);
        if (existingEventIndex > -1) newDayData.events[existingEventIndex] = eventData;
        else newDayData.events.push(eventData);
        newDayData.events.sort((a, b) => a.time.localeCompare(b.time));
        onDataChange(newDateKey, newDayData);
        
        setIsEventModalOpen(false);
    };

    const handleDeleteEvent = (eventId: string, dateKey: string) => {
        const dayData = allData[dateKey];
        if (dayData) {
            const updatedEvents = dayData.events.filter(e => e.id !== eventId);
            onDataChange(dateKey, { ...dayData, events: updatedEvents });
        }
        setIsEventModalOpen(false);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => { onDateChange(new Date(selectedDate.getFullYear(), parseInt(e.target.value, 10), 1)); };
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => { onDateChange(new Date(parseInt(e.target.value, 10), selectedDate.getMonth(), 1)); };
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en-US', { month: 'long' }));

    return (
        <>
            <AddEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSave={handleSaveEvent} onDelete={handleDeleteEvent} date={modalDate} eventToEdit={editingEvent} onGoToDay={handleGoToDay} />
            <ActivityListModal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} data={activityModalData} onEditEvent={handleEditEventFromActivityModal} />
            <div className="bg-brand-light-card dark:bg-brand-navy p-4 sm:p-6 rounded-lg border border-brand-light-border dark:border-brand-gray">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brand-light-text dark:text-white mb-2 sm:mb-0">{selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
                    <div className="flex items-center gap-2">
                        <select value={selectedDate.getMonth()} onChange={handleMonthChange} className="bg-brand-light-bg dark:bg-brand-gray/50 border border-brand-light-border dark:border-brand-gray rounded-md p-2 text-sm text-brand-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue">{months.map((month, index) => <option key={month} value={index}>{month}</option>)}</select>
                        <select value={selectedDate.getFullYear()} onChange={handleYearChange} className="bg-brand-light-bg dark:bg-brand-gray/50 border border-brand-light-border dark:border-brand-gray rounded-md p-2 text-sm text-brand-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue">{years.map(year => <option key={year} value={year}>{year}</option>)}</select>
                    </div>
                </div>
                <div className="grid grid-cols-7 text-center font-bold text-xs text-brand-light-text dark:text-gray-300 mb-2">{daysOfWeek.map(day => <div key={day} className="py-2 hidden sm:block">{day}</div>)}</div>
                <div className="grid grid-cols-7 gap-1">
                    {monthDays.map((day, index) => {
                        const dateKey = day.toISOString().split('T')[0];
                        const data = dailyData[dateKey] || { kpi: 0, revenue: 0, events: [] };
                        const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                        const isToday = day.toDateString() === new Date().toDateString();
                        const groupedEvents = data.events.reduce((acc: Record<CalendarEventType, CalendarEvent[]>, event) => { (acc[event.type] = acc[event.type] || []).push(event); return acc; }, {} as Record<CalendarEventType, CalendarEvent[]>);
                        return (
                            <button key={index} onClick={() => handleDayClick(day)} className={`h-28 sm:h-36 rounded p-2 flex flex-col text-left border transition-colors hover:border-brand-blue ${isCurrentMonth ? 'bg-brand-light-bg dark:bg-brand-navy' : 'bg-gray-50 dark:bg-brand-ink text-gray-400 dark:text-gray-600'} ${isToday ? 'border-brand-blue border-2' : 'border-brand-light-border dark:border-brand-gray'}`}>
                                <span className={`font-black text-lg ${isToday ? 'text-brand-blue dark:text-blue-400' : isCurrentMonth ? 'text-brand-light-text dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{day.getDate()}</span>
                                <div className="flex-grow overflow-y-auto mt-1 space-y-1 pr-1">
                                     {Object.entries(groupedEvents).map(([type, events]) => (<button key={type} onClick={(e) => handleActivityButtonClick(e, type as CalendarEventType, events, day)} className={`w-full text-left text-[10px] rounded px-1.5 py-0.5 truncate font-semibold ${eventTypeColors[type as CalendarEventType]}`} title={`View ${events.length} ${type}(s)`}>{type} ({events.length})</button>))}
                                </div>
                                {isCurrentMonth && (data.kpi > 0 || data.revenue > 0) && (<div className="text-right text-xs mt-auto pt-1"><p className="font-bold text-brand-lime dark:text-green-400" title="Revenue">{formatCurrency(data.revenue)}</p><p className="font-semibold text-brand-blue dark:text-blue-400" title="KPI Score">{data.kpi} KPI</p></div>)}
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    );
};

export default MonthViewPage;
