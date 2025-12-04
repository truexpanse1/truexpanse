import React, { useState, useMemo } from 'react';
import { Contact } from '../types';
import HotLeadCard from '@/components/HotLeadCard';
import StatCard from '@/components/StatCard'; 
import { PlusIcon } from '@heroicons/react/24/outline';

interface HotLeadsPageProps {
  hotLeads: Contact[];
  onAddHotLead: (lead: Contact) => void;
  onUpdateHotLead: (lead: Contact) => void;
  onDeleteHotLead: (leadId: string) => void;
  onConvertLead: (lead: Contact, initialAmountCollected: number) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  handleSetAppointment: () => void;
  onConvertToClient: (contact: Contact, initialAmountCollected: number) => void;
  onEmailLead: (lead: Contact) => void;
  onScheduleLead: (lead: Contact) => void;
}

const HotLeadsPage: React.FC<HotLeadsPageProps> = ({
  hotLeads,
  onUpdateHotLead,
  onDeleteHotLead,
  onConvertLead,
  handleSetAppointment,
  onEmailLead,
  onScheduleLead,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due-today'>('all');

  const filteredLeads = useMemo(() => {
    let leads = hotLeads.filter(lead =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'overdue') {
      leads = leads.filter(lead => {
        if (!lead.followUpSteps || !lead.hotLeadDate) return false;

        const nextStep = lead.followUpSteps.find(step => !step.isCompleted);
        if (!nextStep) return false;

        const dueDate = new Date(lead.hotLeadDate);
        dueDate.setDate(dueDate.getDate() + nextStep.dayOffset);

        return dueDate < today;
      });
    }

    if (filter === 'due-today') {
      leads = leads.filter(lead => {
        if (!lead.followUpSteps || !lead.hotLeadDate) return false;

        const nextStep = lead.followUpSteps.find(step => !step.isCompleted);
        if (!nextStep) return false;

        const dueDate = new Date(lead.hotLeadDate);
        dueDate.setDate(dueDate.getDate() + nextStep.dayOffset);

        return dueDate.getTime() === today.getTime();
      });
    }

    return leads;
  }, [hotLeads, searchTerm, filter]);

  const stats = useMemo(() => {
    const totalLeads = hotLeads.length;

    const overdue = hotLeads.filter(lead => {
      if (!lead.followUpSteps || !lead.hotLeadDate) return false;
      const nextStep = lead.followUpSteps.find(step => !step.isCompleted);
      if (!nextStep) return false;

      const dueDate = new Date(lead.hotLeadDate);
      dueDate.setDate(dueDate.getDate() + nextStep.dayOffset);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;

    const dueToday = filteredLeads.filter(lead => {
      if (!lead.followUpSteps || !lead.hotLeadDate) return false;
      const nextStep = lead.followUpSteps.find(step => !step.isCompleted);
      if (!nextStep) return false;

      const dueDate = new Date(lead.hotLeadDate);
      dueDate.setDate(dueDate.getDate() + nextStep.dayOffset);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length;

    return {
      totalLeads,
      overdue,
      dueToday,
    };
  }, [hotLeads, filteredLeads]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-ink dark:text-white">
        Hot Leads Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Hot Leads" value={stats.totalLeads} />
        <StatCard title="Overdue" value={stats.overdue} isAlert={stats.overdue > 0} />
        <StatCard title="Due Today" value={stats.dueToday} isAlert={stats.dueToday > 0} />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'all'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-200 dark:bg-brand-gray'
            }`}
          >
            All ({stats.totalLeads})
          </button>

          <button
            onClick={() => setFilter('overdue')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'overdue'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-brand-gray'
            }`}
          >
            Overdue ({stats.overdue})
          </button>

          <button
            onClick={() => setFilter('due-today')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'due-today'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-brand-gray'
            }`}
          >
            Due Today ({stats.dueToday})
          </button>
        </div>

        <div className="flex space-x-4 items-center">
          <input
