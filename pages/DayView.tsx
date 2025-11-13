import React, { useMemo, useState } from 'react';
import { DayData, RevenueData, CalendarEvent, Goal, Contact, Transaction, User, getInitialDayData, AIChallengeData, formatCurrency } from '../types';
import Calendar from '../components/Calendar';
import RevenueCard from '../components/RevenueCard';
import AIChallengeCard from '../components/AIChallengeCard';
import ProspectingKPIs from '../components/ProspectingKPIs';
import AppointmentsBlock from '../components/AppointmentsBlock';
import GoalsBlock from '../components/GoalsBlock';
import NewLeadsBlock from '../components/NewLeadsBlock';
import DailyFollowUps from '../components/DailyFollowUps';
import AddLeadModal from '../components/AddLeadModal';
import AddEventModal from '../components/AddEventModal';
import ViewLeadsModal from '../components/ViewLeadsModal';
import ViewAppointmentsModal from '../components/ViewAppointmentsModal';
import WinsTodayCard from '../components/WinsTodayCard';

interface DayViewProps {
    allData: { [key: string]: DayData };
    onDataChange: (dateKey: string, data: DayData) => Promise<void>;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    onWin: (winMessage: string) => void;
    onAddHotLead: (leadData: Omit<Contact, 'id'>) => Promise<Contact | null>;
    onUpdateHotLead: (lead: Contact) => void;
    hotLeads: Contact[];
    transactions: Transaction[];
    users: User[];
}


const DayView: React.FC<DayViewProps> = ({ allData, onDataChange, selectedDate, onDateChange, onWin, onAddHotLead, onUpdateHotLead, hotLeads, transactions, users }) => {
    // Modal States
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isViewLeadsModalOpen, setIsViewLeadsModalOpen] = useState(false);
    const [isViewAppointmentsModalOpen, setIsViewAppointmentsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    const getDateKey = (date: Date): string => date.toISOString().split('T')[0];
    const currentDateKey = getDateKey(selectedDate);

    const currentData: DayData = allData[currentDateKey] || getInitialDayData();

    const updateCurrentData = (updates: Partial<DayData>) => {
        const updatedData = { ...(allData[currentDateKey] || getInitialDayData()), ...updates };
        onDataChange(currentDateKey, updatedData);
    };

    const calculatedRevenue = useMemo<RevenueData>(() => {
        const todayKey = getDateKey(selectedDate);
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(startOfWeek.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        const startOfWeekKey = getDateKey(startOfWeek);
        const endOfWeekKey = getDateKey(endOfWeek);

        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();

        let today = 0, week = 0, month = 0, ytd = 0, mcv = 0;

        transactions.forEach(t => {
            const transactionDate = new Date(t.date + 'T00:00:00'); // Local timezone
            if (t.date === todayKey) today += t.amount;
            if (t.date >= startOfWeekKey && t.date <= endOfWeekKey) week += t.amount;
            if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                month += t.amount;
                if (t.isRecurring) mcv += t.amount;
            }
            if (transactionDate.getFullYear() === currentYear) ytd += t.amount;
        });

        const acv = mcv * 12;

        return {
            today: formatCurrency(today), week: formatCurrency(week), month: formatCurrency(month),
            ytd: formatCurrency(ytd), mcv: formatCurrency(mcv), acv: formatCurrency(acv),
        };

    }, [transactions, selectedDate]);
    
    const handleAIChallengeDataChange = (aiData: AIChallengeData) => {
        updateCurrentData({ aiChallenge: aiData });
    };
    
    const handleGoalChange = (type: 'topTargets' | 'massiveGoals', updatedGoal: Goal) => {
        const goals = currentData[type];
        const newGoals = goals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
        updateCurrentData({ [type]: newGoals });
    };

    const handleGoalCompletion = (goal: Goal) => {
       if (goal.text.trim() !== '') onWin(`Target Completed: ${goal.text}`);
    }
    
    const handleSaveNewLead = async (leadData: Omit<Contact, 'id' | 'date' | 'prospecting' | 'dateAdded' | 'completedFollowUps'>) => {
        const newHotLead = {
            ...leadData,
            date: currentDateKey,
            prospecting: {},
            dateAdded: new Date().toISOString(),
            completedFollowUps: {}
        };
        const addedLead = await onAddHotLead(newHotLead);
        if (addedLead) {
            const contacts = [...(currentData.prospectingContacts || [])];
            const emptyIndex = contacts.findIndex(c => !c.name);
            if (emptyIndex !== -1) {
                contacts[emptyIndex] = { ...contacts[emptyIndex], ...addedLead };
            } else {
                contacts.push({ ...addedLead, id: `contact-new-${Date.now()}` });
            }
            updateCurrentData({ prospectingContacts: contacts });
            onWin(`New Lead Added: ${addedLead.name}`);
        }
        setIsLeadModalOpen(false);
    };

    const handleAddAppointment = () => { setEditingEvent(null); setIsEventModalOpen(true); };
    const handleViewAppointment = (event: CalendarEvent) => { setEditingEvent(event); setIsEventModalOpen(true); };
    const handleEditAppointmentFromModal = (event: CalendarEvent) => {
        setIsViewAppointmentsModalOpen(false);
        setTimeout(() => handleViewAppointment(event), 100);
    }

    const handleSaveEvent = (eventData: CalendarEvent, originalDateKey: string | null, newDateKey: string) => {
        if (originalDateKey && allData[originalDateKey] && originalDateKey !== newDateKey) {
            const originalDayData = allData[originalDateKey];
            const updatedEvents = originalDayData.events.filter(e => e.id !== eventData.id);
            onDataChange(originalDateKey, { ...originalDayData, events: updatedEvents });
        }

        const newDayData = allData[newDateKey] || getInitialDayData();
        const existingEventIndex = newDayData.events.findIndex(e => e.id === eventData.id);
        if (existingEventIndex > -1) {
            newDayData.events[existingEventIndex] = eventData;
        } else {
            newDayData.events.push(eventData);
        }
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

    const appointments = useMemo(() => (currentData.events || []).filter(event => event.type === 'Appointment'), [currentData.events]);
    const leadsAddedToday = useMemo(() => (currentData.prospectingContacts || []).filter(c => c.name), [currentData.prospectingContacts]);

    return (
        <>
            <AddLeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} onSave={handleSaveNewLead} />
            <AddEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSave={handleSaveEvent} onDelete={handleDeleteEvent} date={selectedDate} eventToEdit={editingEvent} />
            <ViewLeadsModal isOpen={isViewLeadsModalOpen} onClose={() => setIsViewLeadsModalOpen(false)} leads={leadsAddedToday} users={users} />
            <ViewAppointmentsModal isOpen={isViewAppointmentsModalOpen} onClose={() => setIsViewAppointmentsModalOpen(false)} appointments={appointments} onEditAppointment={handleEditAppointmentFromModal} />

            <div className="text-left mb-6">
                <h2 className="text-2xl font-bold uppercase text-brand-light-text dark:text-white">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</h2>
                <p className="text-brand-light-gray dark:text-gray-400 text-sm font-medium">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-start">
                {/* Left Column */}
                <div className="space-y-8">
                    <Calendar selectedDate={selectedDate} onDateChange={onDateChange} />
                    <RevenueCard data={calculatedRevenue} transactions={transactions} selectedDate={selectedDate} />
                    <AIChallengeCard data={currentData.aiChallenge} onDataChange={handleAIChallengeDataChange} onWin={onWin} />
                </div>
                
                {/* Middle Column */}
                <div className="space-y-8">
                    <ProspectingKPIs contacts={currentData.prospectingContacts || []} />
                    <AppointmentsBlock appointmentsCount={appointments.length} onAddAppointment={handleAddAppointment} onViewAppointments={() => setIsViewAppointmentsModalOpen(true)} />
                    <DailyFollowUps hotLeads={hotLeads} onUpdateHotLead={onUpdateHotLead} selectedDate={selectedDate} onWin={onWin} />
                    <WinsTodayCard wins={currentData.winsToday || []} />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <GoalsBlock title="Today's Top 6 Targets" goals={currentData.topTargets} onGoalChange={(goal) => handleGoalChange('topTargets', goal)} onGoalComplete={handleGoalCompletion} />
                    <GoalsBlock title="Massive Action Goals" goals={currentData.massiveGoals} onGoalChange={(goal) => handleGoalChange('massiveGoals', goal)} highlight />
                    <NewLeadsBlock leadsCount={leadsAddedToday.length} onAddLeadClick={() => setIsLeadModalOpen(true)} onViewLeadsClick={() => setIsViewLeadsModalOpen(true)} />
                </div>
            </div>
        </>
    );
};

export default DayView;