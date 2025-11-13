
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

import { View, User, Role, DayData, Transaction, Contact, Quote, NewClient, CalendarEvent, getInitialDayData } from './types';

// Page Components
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import DayView from './pages/DayView';
import ProspectingPage from './pages/ProspectingPage';
import HotLeadsPage from './pages/HotLeadsPage';
import NewClientsPage from './pages/NewClientsPage';
import RevenuePage from './pages/RevenuePage';
import MonthViewPage from './pages/MonthViewPage';
import AIImagesPage from './pages/AIImagesPage';
import AIContentPage from './pages/AIContentPage';
import CoachingPage from './pages/CoachingPage';
import TeamControlPage from './pages/TeamControlPage';
import PerformanceDashboardPage from './pages/PerformanceDashboardPage';
import EODReportPage from './pages/EODReportPage';
import ChatIcon from './components/ChatIcon';
import ChatBot from './components/ChatBot';
import Confetti from './components/Confetti';

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Global State
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [view, setView] = useState<View>('day-view');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Data State
    const [allData, setAllData] = useState<{ [key: string]: DayData }>({});
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [hotLeads, setHotLeads] = useState<Contact[]>([]);
    const [newClients, setNewClients] = useState<NewClient[]>([]);
    const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);

    // UI State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [winMessage, setWinMessage] = useState('');
    const [contextualUserId, setContextualUserId] = useState<string | null>(null);

    // Theme effect
    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    // Auth and data loading effect
    useEffect(() => {
        const fetchSessionAndProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session) {
                const { data: userProfile } = await supabase.from('users').select('*').eq('id', session.user.id).single();
                setUser(userProfile);
            }
            setIsLoading(false);
        };
        fetchSessionAndProfile();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) { // Handle logout
                setUser(null); setAllData({}); setHotLeads([]); setTransactions([]);
                setNewClients([]); setSavedQuotes([]); setUsers([]);
            } else {
                 const fetchProfileOnLogin = async () => {
                    const { data: userProfile } = await supabase.from('users').select('*').eq('id', session.user.id).single();
                    setUser(userProfile);
                 }
                 fetchProfileOnLogin();
            }
        });

        return () => { authListener.subscription.unsubscribe(); };
    }, []);

    // Main data fetching effect when user is available
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setIsLoading(true);
            const userIdToFetch = user.role === 'Manager' ? null : user.id; // Managers see all, Reps see their own

            let dayDataQuery = supabase.from('day_data').select('*');
            let hotLeadsQuery = supabase.from('hot_leads').select('*');
            let transactionsQuery = supabase.from('transactions').select('*');
            let clientsQuery = supabase.from('clients').select('*');
            let quotesQuery = supabase.from('quotes').select('*');
            
            if (userIdToFetch) {
                dayDataQuery = dayDataQuery.eq('user_id', userIdToFetch);
                hotLeadsQuery = hotLeadsQuery.eq('user_id', userIdToFetch);
                transactionsQuery = transactionsQuery.eq('user_id', userIdToFetch);
                clientsQuery = clientsQuery.eq('user_id', userIdToFetch);
                quotesQuery = quotesQuery.eq('user_id', userIdToFetch);
            }
            
            const [ dayDataRes, hotLeadsRes, transactionsRes, clientsRes, quotesRes, usersRes ] = await Promise.all([
                dayDataQuery, hotLeadsQuery, transactionsQuery, clientsQuery, quotesQuery, supabase.from('users').select('*')
            ]);
            
            if (dayDataRes.data) {
                const structuredDayData = dayDataRes.data.reduce((acc: any, row: any) => { acc[row.date] = row.data; return acc; }, {});
                setAllData(structuredDayData);
            }
            if (hotLeadsRes.data) setHotLeads(hotLeadsRes.data as any[]);
            if (transactionsRes.data) setTransactions(transactionsRes.data as any[]);
            if (clientsRes.data) setNewClients(clientsRes.data as any[]);
            if (quotesRes.data) setSavedQuotes(quotesRes.data as any[]);
            if (usersRes.data) setUsers(usersRes.data as any[]);

            setIsLoading(false);
        };
        fetchData();
    }, [user]);
    
    // Confetti effect
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => { setShowConfetti(false); setWinMessage(''); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    // --- DATA HANDLERS ---
    const handleWin = (message: string) => { setWinMessage(message); setShowConfetti(true); };

    const handleUpsertDayData = async (dateKey: string, data: DayData) => {
        if (!user) return;
        setAllData(prev => ({ ...prev, [dateKey]: data }));
        await supabase.from('day_data').upsert({ user_id: user.id, date: dateKey, data: data }, { onConflict: 'user_id, date' });
    };
    
    const handleEODSubmission = (dateKey: string) => {
        const dayData = allData[dateKey] || getInitialDayData();
        handleUpsertDayData(dateKey, { ...dayData, eodSubmitted: true });
        handleWin('EOD Report Submitted!');
    };

    const handleAddHotLead = async (leadData: Omit<Contact, 'id'>): Promise<Contact | null> => {
        if (!user) return null;
        const { data, error } = await supabase.from('hot_leads').insert({ ...leadData, user_id: user.id }).select().single();
        if (error) { console.error("Error adding hot lead:", error); return null; }
        setHotLeads(prev => [...prev, data as any]);
        return data as any;
    };

    const handleUpdateHotLead = async (lead: Contact) => {
        if (!user) return;
        setHotLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
        await supabase.from('hot_leads').update(lead).eq('id', lead.id);
    };
    
    const handleDeleteHotLead = async (leadId: string) => {
        if (!user) return;
        setHotLeads(prev => prev.filter(l => l.id !== leadId));
        await supabase.from('hot_leads').delete().eq('id', leadId);
    };

    const handleSaveNewClient = async (clientData: NewClient) => {
        if (!user) return;
        if (String(clientData.id).startsWith('manual-')) {
            const { data, error } = await supabase.from('clients').insert({ ...clientData, user_id: user.id, id: undefined }).select().single();
            if (data) setNewClients(prev => [...prev, data as any]); else console.error(error);
        } else {
            setNewClients(prev => prev.map(c => c.id === clientData.id ? clientData : c));
            await supabase.from('clients').update(clientData).eq('id', clientData.id);
        }
    };
    
    const handleSaveTransaction = async (transData: Transaction) => {
        if (!user) return;
        if (String(transData.id).startsWith('new-')) {
            const { data, error } = await supabase.from('transactions').insert({ ...transData, user_id: user.id, id: undefined }).select().single();
            if(data) setTransactions(prev => [...prev, data as any]); else console.error(error);
        } else {
            setTransactions(prev => prev.map(t => t.id === transData.id ? transData : t));
            await supabase.from('transactions').update(transData).eq('id', transData.id);
        }
    };

    const handleDeleteTransaction = async (transId: string) => {
        if (!user) return;
        setTransactions(prev => prev.filter(t => t.id !== transId));
        await supabase.from('transactions').delete().eq('id', transId);
    };
    
    const handleSaveQuote = async (quoteData: Omit<Quote, 'id'>) => {
        if (!user) return;
        const { data } = await supabase.from('quotes').insert({ ...quoteData, user_id: user.id }).select().single();
        setSavedQuotes(prev => [data as any, ...prev]);
    };

    const handleRemoveQuote = async (quoteId: string) => {
        if (!user) return;
        setSavedQuotes(prev => prev.filter(q => q.id !== quoteId));
        await supabase.from('quotes').delete().eq('id', quoteId);
    };
    
    const handleSetAppointment = (appointment: { client: string, lead: string, time: string, details?: string }, date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        const dayData = allData[dateKey] || getInitialDayData();
        const newEvent: CalendarEvent = { id: `appt-${Date.now()}`, time: appointment.time, type: 'Appointment', title: `Appt: ${appointment.client}`, client: appointment.client, details: appointment.details || `From ${appointment.lead}` };
        const events = [...(dayData.events || []), newEvent].sort((a, b) => a.time.localeCompare(b.time));
        handleUpsertDayData(dateKey, { ...dayData, events });
        handleWin(`Appointment Set: ${appointment.client}`);
        setView('month-view');
        setSelectedDate(date);
    };

    const handleConvertToClient = async (contact: Contact, initialAmountCollected: number) => {
        if(!user) return;
        const closeDate = new Date().toISOString().split('T')[0];
        const { data: newClientData, error: clientError } = await supabase.from('clients').insert({ name: contact.name, company: contact.company || '', phone: contact.phone, email: contact.email, initial_amount_collected: initialAmountCollected, close_date: closeDate, user_id: user.id, stage: 'New' }).select().single();
        if (clientError) { console.error(clientError); return; }

        await handleSaveTransaction({ id: 'new-', date: closeDate, clientName: contact.name, product: 'Initial Service', amount: initialAmountCollected, isRecurring: false });
        await handleDeleteHotLead(String(contact.id));
        if (newClientData) setNewClients(prev => [...prev, newClientData as any]);

        handleWin(`New Client Won! ${contact.name}`);
        setView('new-clients');
    };
    
    const handleViewUserTrends = (userId: string) => { setContextualUserId(userId); setView('performance-dashboard'); };

    // --- RENDER LOGIC ---
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-brand-light-bg dark:bg-brand-ink"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-red"></div></div>;
    }
    
    if (!session || !user) { return <LoginPage />; }

    const renderView = () => {
        const userEODSubmissions = Object.entries(allData).reduce((acc: any, [dateKey, dayData]) => { if (dayData.eodSubmitted) { acc[dateKey] = true; } return acc; }, {});
        
        switch (view) {
            case 'day-view': return <DayView onDataChange={handleUpsertDayData} allData={allData} selectedDate={selectedDate} onDateChange={setSelectedDate} onWin={handleWin} onAddHotLead={handleAddHotLead} onUpdateHotLead={handleUpdateHotLead} hotLeads={hotLeads} transactions={transactions} users={users} />;
            case 'month-view': return <MonthViewPage allData={allData} onDataChange={handleUpsertDayData} transactions={transactions} selectedDate={selectedDate} onDateChange={setSelectedDate} setView={setView} />;
            case 'prospecting': return <ProspectingPage allData={allData} onDataChange={handleUpsertDayData} selectedDate={selectedDate} onDateChange={setSelectedDate} onAddHotLead={handleAddHotLead} onWin={handleWin} handleSetAppointment={handleSetAppointment} />;
            case 'hot-leads': return <HotLeadsPage hotLeads={hotLeads} onAddHotLead={handleAddHotLead} onUpdateHotLead={handleUpdateHotLead} onDeleteHotLead={handleDeleteHotLead} selectedDate={selectedDate} onDateChange={setSelectedDate} handleSetAppointment={handleSetAppointment} onConvertToClient={handleConvertToClient} />;
            case 'new-clients': return <NewClientsPage newClients={newClients} onSaveClient={handleSaveNewClient} selectedDate={selectedDate} onDateChange={setSelectedDate} loggedInUser={user} users={users} />;
            case 'revenue': return <RevenuePage transactions={transactions} onSaveTransaction={handleSaveTransaction} onDeleteTransaction={handleDeleteTransaction} selectedDate={selectedDate} onDateChange={setSelectedDate} />;
            case 'ai-images': return <AIImagesPage />;
            case 'ai-content': return <AIContentPage />;
            case 'coaching': return <CoachingPage savedQuotes={savedQuotes} onSaveQuote={handleSaveQuote} onRemoveQuote={handleRemoveQuote} />;
            case 'team-control': return <TeamControlPage users={users} onViewUserTrends={handleViewUserTrends} />;
            case 'performance-dashboard': return <PerformanceDashboardPage allData={allData} transactions={transactions} users={users} contextualUserId={contextualUserId} setContextualUserId={setContextualUserId} eodSubmissions={{ [user.id]: userEODSubmissions }} />;
            case 'eod-report': return <EODReportPage allData={allData} selectedDate={selectedDate} onDateChange={setSelectedDate} hotLeads={hotLeads} onSubmission={handleEODSubmission} userId={user.id} />;
            default: return <div>View not found</div>;
        }
    };

    return (
        <div className="min-h-screen font-sans antialiased bg-brand-light-bg dark:bg-brand-ink transition-colors duration-300">
            {showConfetti && <Confetti />}
            <Header
                theme={theme}
                setTheme={setTheme}
                setView={setView}
                currentView={view}
                userRole={user.role}
                onLogout={() => supabase.auth.signOut()}
                userName={user.name}
            />
            <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">{renderView()}</main>
            {showConfetti && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-brand-lime text-brand-ink font-bold p-4 rounded-lg shadow-2xl z-50">🎉 {winMessage} 🎉</div>}
            <ChatIcon onClick={() => setIsChatOpen(true)} />
            <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
};

export default App;
