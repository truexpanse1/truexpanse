import React from 'react';

interface NewLeadsBlockProps {
    leadsCount: number;
    onAddLeadClick: () => void;
    onViewLeadsClick: () => void;
}

const NewLeadsBlock: React.FC<NewLeadsBlockProps> = ({ leadsCount, onAddLeadClick, onViewLeadsClick }) => {
    return (
        <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
            <h3 className="text-sm font-bold text-brand-red uppercase mb-2">New Leads Today</h3>
            <div className="text-center my-4">
                <p className="text-6xl font-black text-brand-light-text dark:text-white">{leadsCount}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={onViewLeadsClick}
                    disabled={leadsCount === 0}
                    className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm disabled:bg-brand-gray disabled:cursor-not-allowed"
                >
                    View Leads
                </button>
                <button onClick={onAddLeadClick} className="w-full bg-brand-lime text-brand-ink font-bold py-2 px-4 rounded-lg hover:bg-green-400 transition text-sm">
                    + Add Lead
                </button>
            </div>
        </div>
    );
};

export default NewLeadsBlock;