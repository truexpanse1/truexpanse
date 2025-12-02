import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { Contact, DayData, Transaction, EODAction, ContactType, ContactStatus } from './types';
import Header from './components/Header';
import DayView from './pages/DayView';
import RevenuePage from './pages/RevenuePage';
import TeamControlPage from './pages/TeamControlPage';
import ProspectingPage from './pages/ProspectingPage';
import HotLeadsPage from './pages/HotLeadsPage';
import CoachingPage from './pages/CoachingPage';
import AIImagesPage from './pages/AIImagesPage';
import AIContentPage from './pages/AIContentPage';
import Login from './pages/Login';
import Loading from './components/Loading';
import { useAuth } from './hooks/useAuth';

type View = 'day-view' | 'revenue' | 'team-control' | 'prospecting' | 'hot-leads' | 'coaching' | 'ai-images' | 'ai-content';

const App: React.FC = () => {
  const { session, user, loading: authLoading } = useAuth();
  const [view, setView] = useState<View>('day-view');
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<DayData[]>([]);
  const [hotLeads, setHotLeads] = useState<Contact[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [teamUsers, setTeamUsers] = useState<User[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Production mode enabled - Final Fix Applied.
  const isDemoMode = false; 

  useEffect(() => {
    if (user) {
      fetchData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    if (!user) return;

    const [dayDataRes, hotLeadsRes, transactionsRes, teamUsersRes] = await Promise.all([
      supabase.from('day_data').select('*').eq('user_id', user.id),
      supabase.from('hot_leads').select('*').eq('user_id', user.id),
      supabase.from('transactions').select('*').eq('user_id', user.id),
      supabase.from('users').select('*').eq('company_id', user.company_id),
    ]);

    if (dayDataRes.data) setAllData(dayDataRes.data as DayData[]);
    if (hotLeadsRes.data) setHotLeads(hotLeadsRes.data.map(d => ({
      ...d,
      interestLevel: d.interest_level,
      dateAdded: d.date_added,
      appointmentDate: d.appointment_date,
      completedFollowUps: d.completed_follow_ups,
      userId: d.user_id,
    })) as Contact[]);
    if (transactionsRes.data) setTransactions(transactionsRes.data as Transaction[]);
    if (teamUsersRes.data) setTeamUsers(teamUsersRes.data as User[]);

    setLoading(false);
  };

  const handleUpsertDayData = async (data: DayData) => {
    if (!user) return;
    const payload = { ...data, user_id: user.id };
    const { data: updatedData, error } = await supabase
      .from('day_data')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error upserting day data:', error);
      return;
    }

    setAllData(prev => {
      const existingIndex = prev.findIndex(d => d.date === updatedData.date);
      if (existingIndex > -1) {
        return prev.map((d, i) => i === existingIndex ? updatedData : d);
      }
      return [...prev, updatedData];
    });
  };

  const handleAddWin = async (win: { type: string, value: number, date: string }) => {
    if (!user) return;
    const payload = { ...win, user_id: user.id };
    const { data: newTransaction, error } = await supabase
      .from('transactions')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error adding win:', error);
      return;
    }

    setTransactions(prev => [...prev, newTransaction as Transaction]);
  };

  // --- START: Hot Lead Handlers (Corrected and Restored) ---

  const handleAddHotLead = async (
    leadData: Omit<Contact, 'id'>
  ): Promise<Contact | null> => {
    if (!user) { 
      alert('User profile data is incomplete. Please log out and log back in.'); 
      return null; 
    }
    const payload = {
      user_id: user.id,
      // company_id: user.company_id, // REMOVED FOR WORKAROUND
      name: leadData.name,
      company: leadData.company,
      date: leadData.date,
      phone: leadData.phone,
      email: leadData.email,
      interest_level: leadData.interestLevel,
      prospecting: leadData.prospecting,
      date_added: leadData.dateAdded,
      appointment_date: leadData.appointmentDate,
      completed_follow_ups: leadData.completedFollowUps,
    };
    const { data, error } = await supabase
      .from('hot_leads')
      .insert(payload)
      .select()
      .single();
    if (error) {
      console.error('Error adding hot lead:', error);
      alert('Failed to add lead. Check console for details. This is often an RLS or permission issue: ' + error.message);
      return null;
    }
    const newLead: Contact = {
      ...data,
      id: String(data.id),
      interestLevel: data.interest_level,
      dateAdded: data.date_added,
      appointmentDate: data.appointment_date,
      completedFollowUps: data.completed_follow_ups,
      userId: data.user_id,
    };
    setHotLeads((prev) => [...prev, newLead]);
    return newLead;
  };

  const handleUpdateHotLead = async (lead: Contact) => {
    setHotLeads((prev) => prev.map((l) => (l.id === lead.id ? lead : l)));
    if (!user) return;
    await supabase
      .from('hot_leads')
      .update({
        name: lead.name,
        company: lead.company,
        date: lead.date,
        phone: lead.phone,
        email: lead.email,
        interest_level: lead.interestLevel,
        prospecting: lead.prospecting,
        date_added: lead.dateAdded,
        appointment_date: lead.appointmentDate,
        completed_follow_ups: lead.completedFollowUps,
      })
      .eq('id', lead.id);
  };

  const handleDeleteHotLead = async (leadId: string) => {
    setHotLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (!user) return;
    await supabase.from('hot_leads').delete().eq('id', leadId);
  };

  // --- END: Hot Lead Handlers ---

  // --- START: New KPI/EOD Integration Handlers ---

  const handleEmailLead = async (lead: Contact) => {
    // 1. Log the action for the EOD report
    const action: EODAction = {
      type: 'Email Sent',
      description: `Emailed hot lead: ${lead.name}`,
      date: new Date().toISOString().split('T')[0],
    };
    console.log('EOD Action: Email Sent', action);
    // You would typically call a function like: handleAddEODAction(action);

    // 2. Open the user's default email client
    window.location.href = `mailto:${lead.email}?subject=Following up on your interest in ${lead.company}`;
  };

  const handleScheduleLead = async (lead: Contact) => {
    // 1. Log the action for the EOD report
    const action: EODAction = {
      type: 'Appointment Set',
      description: `Scheduled appointment for hot lead: ${lead.name}`,
      date: new Date().toISOString().split('T')[0],
    };
    console.log('EOD Action: Appointment Set', action);
    // You would typically call a function like: handleAddEODAction(action);

    // 2. Open the appointment modal (The logic for this is already in HotLeadsPage)
    alert(`Ready to schedule appointment for ${lead.name}. This would open the SetAppointmentModal.`);
  };

  // --- END: New KPI/EOD Integration Handlers ---

  const handleConvertToClient = async (contact: Contact, initialAmountCollected: number) => {
    if (!user) return;

    // 1. Add transaction for the initial amount
    await handleAddWin({
      type: 'Initial Client Payment',
      value: initialAmountCollected,
      date: new Date().toISOString().split('T')[0],
    });

    // 2. Update contact status to client
    await supabase
      .from('hot_leads')
      .update({
        type: ContactType.Client,
        status: ContactStatus.Active,
      })
      .eq('id', contact.id);

    // 3. Remove from hot leads state and refetch data
    setHotLeads(prev => prev.filter(l => l.id !== contact.id));
    fetchData();
  };

  const renderView = () => {
    if (!session) return <Login />;
    if (loading || authLoading) return <Loading />;

    switch (view) {
      case 'day-view':
        return (
          <DayView
            user={user!}
            onDataChange={handleUpsertDayData}
            allData={allData}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddWin={handleAddWin}
            onAddHotLead={handleAddHotLead}
            onUpdateHotLead={handleUpdateHotLead}
            hotLeads={hotLeads}
            transactions={transactions}
            users={teamUsers}
            onNavigateToRevenue={() => setView('revenue')}
          />
        );
      case 'revenue':
        return <RevenuePage transactions={transactions} />;
      case 'team-control':
        return <TeamControlPage users={teamUsers} onViewUserTrends={() => {}} />;
      case 'prospecting':
        return (
          <ProspectingPage
            onAddHotLead={handleAddHotLead}
            onUpdateHotLead={handleUpdateHotLead}
            onDeleteHotLead={handleDeleteHotLead}
            hotLeads={hotLeads}
          />
        );
      case 'hot-leads':
        return (
          <HotLeadsPage
            hotLeads={hotLeads}
            onAddHotLead={handleAddHotLead}
            onUpdateHotLead={handleUpdateHotLead}
            onDeleteHotLead={handleDeleteHotLead}
            onConvertLead={handleConvertToClient}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            handleSetAppointment={() => {}} // Placeholder for now
            onConvertToClient={handleConvertToClient}
            // ADDED NEW PROPS:
            onEmailLead={handleEmailLead}
            onScheduleLead={handleScheduleLead}
          />
        );
      case 'coaching':
        return <CoachingPage />;
      case 'ai-images':
        return <AIImagesPage />;
      case 'ai-content':
        return <AIContentPage />;
      default:
        return <DayView user={user!} onDataChange={handleUpsertDayData} allData={allData} selectedDate={selectedDate} onDateChange={setSelectedDate} onAddWin={handleAddWin} onAddHotLead={handleAddHotLead} onUpdateHotLead={handleUpdateHotLead} hotLeads={hotLeads} transactions={transactions} users={teamUsers} onNavigateToRevenue={() => setView('revenue')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light-bg dark:bg-brand-ink">
      <Header currentView={view} setView={setView} isDemoMode={isDemoMode} />
      <main className="flex-grow p-4 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
