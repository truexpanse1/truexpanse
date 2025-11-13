
import React, { useState, useMemo } from 'react';
import { DayData, Transaction, getInitialDayData, formatCurrency, Contact } from '../types';
import ActivityBlock from '../components/ActivityBlock';
import { generateResponse } from '../services/geminiService';
import DatePicker from '../components/DatePicker';

interface EODReportPageProps {
  allData: { [key: string]: DayData };
  hotLeads: Contact[];
  onSubmission: (dateKey: string) => void;
  userId: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const EODReportPage: React.FC<EODReportPageProps> = ({ allData, hotLeads, onSubmission, userId, selectedDate, onDateChange }) => {
    const getDateKey = (date: Date): string => date.toISOString().split('T')[0];
    const currentDateKey = getDateKey(selectedDate);
    
    const [wins, setWins] = useState('');
    const [losses, setLosses] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const currentData = useMemo(() => allData[currentDateKey] || getInitialDayData(), [allData, currentDateKey]);
    const isSubmitted = currentData.eodSubmitted;

    const dailySummary = useMemo(() => {
        const callsMade = (currentData.prospectingContacts || []).filter(c => c.prospecting.SW || c.prospecting.NA || c.prospecting.LM).length;
        const apptsSet = (currentData.prospectingContacts || []).filter(c => c.prospecting.SA).length;
        const newLeadsCount = hotLeads.filter(l => l.dateAdded && l.dateAdded.startsWith(currentDateKey)).length;
        const topTargetsCompleted = (currentData.topTargets || []).filter(g => g.completed).length;
        const totalTargets = (currentData.topTargets || []).filter(g => g.text).length;

        return `
            - Calls Made: ${callsMade}
            - Appointments Set: ${apptsSet}
            - New Hot Leads: ${newLeadsCount}
            - Top Targets Completed: ${topTargetsCompleted}/${totalTargets}
        `;
    }, [currentData, hotLeads, currentDateKey]);

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        const prompt = `
            Based on the following daily activity log, generate a concise, professional end-of-day summary. 
            Focus on achievements and suggest one key area for improvement tomorrow.
            
            Today's Data:
            ${dailySummary}

            Wins (from user):
            ${wins}

            Losses/Challenges (from user):
            ${losses}
        `;

        try {
            const generatedSummary = await generateResponse(prompt, false);
            setSummary(generatedSummary);
        } catch (error) {
            console.error(error);
            alert("Failed to generate AI summary.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!wins && !losses) {
            alert("Please fill in your wins and losses before submitting.");
            return;
        }
        onSubmission(currentDateKey);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-brand-light-text dark:text-white">End of Day Report</h1>
                <div className="mt-2 w-48 mx-auto">
                    <DatePicker value={currentDateKey} onChange={(dateStr) => onDateChange(new Date(dateStr + 'T00:00:00'))} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ActivityBlock title="Today's Wins & Accomplishments" value={wins} onChange={setWins} rows={6} />
                <ActivityBlock title="Losses & Challenges Faced" value={losses} onChange={setLosses} rows={6} />
            </div>
            
            <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-brand-red uppercase">AI-Generated Summary</h3>
                    <button onClick={handleGenerateSummary} disabled={isLoading} className="bg-brand-blue text-white font-bold py-1 px-4 rounded-lg hover:bg-blue-700 transition text-sm disabled:bg-brand-gray">
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                 <textarea 
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={8}
                    placeholder="Click 'Generate' to create an AI summary of your day, or write your own here."
                    className="w-full bg-brand-light-bg dark:bg-brand-gray/50 border border-brand-light-border dark:border-brand-gray text-brand-light-text dark:text-white text-sm focus:outline-none focus:border-brand-blue transition-colors resize-none p-2 rounded"
                />
            </div>

            <div className="text-center">
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className="w-full max-w-sm bg-brand-lime text-brand-ink font-black py-3 px-6 rounded-lg hover:bg-green-400 transition text-lg disabled:bg-brand-gray disabled:cursor-not-allowed disabled:text-gray-500"
                >
                    {isSubmitted ? 'Submitted for Today' : 'Submit EOD Report'}
                </button>
            </div>
        </div>
    );
};

export default EODReportPage;
