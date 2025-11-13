import React, { useState } from 'react';
import { Quote } from '../types';

interface SavedQuotesCardProps {
    savedQuotes: Quote[];
    onSaveQuote: (quote: Omit<Quote, 'id'>) => void;
    onRemoveQuote: (quoteId: string) => void;
}

const SavedQuotesCard: React.FC<SavedQuotesCardProps> = ({ savedQuotes, onSaveQuote, onRemoveQuote }) => {
    const [customQuote, setCustomQuote] = useState('');
    const [customAuthor, setCustomAuthor] = useState('');

    const handleAddCustomQuote = () => {
        if (customQuote.trim() && customAuthor.trim()) {
            onSaveQuote({ text: customQuote, author: customAuthor });
            setCustomQuote('');
            setCustomAuthor('');
        } else {
            alert('Please fill in both the quote and the author.');
        }
    };

    const handleShare = async (quote: Quote) => {
        const shareData = {
            title: `Quote by ${quote.author}`,
            text: `"${quote.text}" - ${quote.author}`,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support navigator.share
                await navigator.clipboard.writeText(shareData.text);
                alert('Quote copied to clipboard!');
            }
        } catch (err) {
            console.error('Share failed:', err);
            // Fallback if share fails for any reason
            await navigator.clipboard.writeText(shareData.text);
            alert('Could not open share dialog. Quote copied to clipboard instead!');
        }
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    return (
        <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
            <h3 className="text-lg font-bold mb-4 bg-brand-gray/80 text-white p-2 rounded text-center">MY SAVED QUOTES</h3>
            
            {/* Display Saved Quotes */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto mb-4 pr-2">
                {savedQuotes.length > 0 ? (
                    savedQuotes.map(quote => (
                        <div key={quote.id} className="bg-brand-light-bg dark:bg-brand-gray/50 p-3 rounded-md flex flex-col">
                            <div className="flex-grow">
                                <p className="italic text-sm text-brand-light-text dark:text-gray-300">"{quote.text}"</p>
                                <p className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">- {quote.author}</p>
                            </div>
                             <div className="flex justify-between items-center mt-2 border-t border-brand-light-border dark:border-brand-gray pt-2">
                                <span className="text-xs text-gray-400 dark:text-gray-500">{quote.savedAt ? `Saved: ${formatDate(quote.savedAt)}` : ''}</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleShare(quote)} className="p-1 rounded-full text-gray-400 hover:bg-gray-300 dark:hover:bg-brand-gray" title="Share Quote">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                                    </button>
                                    <button onClick={() => onRemoveQuote(quote.id)} className="p-1 rounded-full text-red-500 hover:bg-red-500/10" title="Remove Quote">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">Your saved quotes will appear here. Click the bookmark icon on a quote to save it.</p>
                )}
            </div>

            {/* Add Custom Quote */}
            <div className="border-t border-brand-light-border dark:border-brand-gray pt-4">
                <h4 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">Add a Custom Quote</h4>
                <div className="space-y-2">
                    <textarea
                        value={customQuote}
                        onChange={e => setCustomQuote(e.target.value)}
                        placeholder="The quote that inspired you..."
                        rows={3}
                        className="w-full bg-brand-light-bg dark:bg-brand-gray/50 border border-brand-light-border dark:border-brand-gray rounded-md p-2 text-sm text-brand-light-text dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                     <input 
                        type="text" 
                        placeholder="Author or Source" 
                        value={customAuthor}
                        onChange={e => setCustomAuthor(e.target.value)}
                        className="w-full bg-transparent border-b border-dashed border-brand-light-border dark:border-brand-gray text-brand-light-text dark:text-white text-sm p-1 focus:outline-none focus:border-brand-blue focus:border-solid"
                    />
                    <button 
                        onClick={handleAddCustomQuote}
                        className="w-full bg-brand-lime text-brand-ink font-bold py-2 px-4 rounded-lg hover:bg-green-400 transition text-sm"
                    >
                        Save My Quote
                    </button>
                </div>
            </div>

        </div>
    );
};

export default SavedQuotesCard;