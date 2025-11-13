import React, { useMemo } from 'react';
import { Contact } from '../types';

interface ProspectingKPIsProps {
  contacts: Contact[];
}

const ProspectingKPIs: React.FC<ProspectingKPIsProps> = ({ contacts }) => {
    const metrics = useMemo(() => {
        const callsMade = contacts.filter(c => c.prospecting.SW || c.prospecting.NA || c.prospecting.LM).length;
        const textsSent = contacts.filter(c => c.prospecting.ST).length;
        const emailsSent = contacts.filter(c => c.prospecting.EP).length;
        const apptsSet = contacts.filter(c => c.prospecting.SA).length;
        const newLeads = contacts.filter(c => c.name).length;
        const quotesSent = emailsSent;

        return { callsMade, textsSent, emailsSent, apptsSet, newLeads, quotesSent };
    }, [contacts]);

    return (
        <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
             <h3 className="text-lg font-bold mb-4 bg-brand-gray/80 text-white p-2 rounded text-center">DAILY PROSPECTING KPIS</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <div className="text-center">
                    <p className="text-3xl font-black text-brand-lime">{metrics.callsMade}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Calls Made</p>
                </div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-brand-lime">{metrics.textsSent}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Texts Sent</p>
                </div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-brand-lime">{metrics.emailsSent}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Emails Sent</p>
                </div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-brand-lime">{metrics.apptsSet}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Appointments Set</p>
                </div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-brand-lime">{metrics.newLeads}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">New Leads</p>
                </div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-brand-lime">{metrics.quotesSent}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Quotes Sent</p>
                </div>
             </div>
        </div>
    );
};

export default ProspectingKPIs;