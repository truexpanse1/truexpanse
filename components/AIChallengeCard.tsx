import React, { useState, useEffect } from 'react';
import { AIChallengeData } from '../types';
import { getDailyQuote, getSalesChallenges } from '../services/geminiService';

interface AIChallengeCardProps {
    data: AIChallengeData;
    onDataChange: (data: AIChallengeData) => void;
    onWin: (challengeText: string) => void;
}

const AIChallengeCard: React.FC<AIChallengeCardProps> = ({ data, onDataChange, onWin }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            if (!data.quote) {
                setIsLoading(true);
                try {
                    const newQuote = await getDailyQuote();
                    onDataChange({ ...data, quote: newQuote });
                } catch (error) {
                    console.error("Failed to fetch quote:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchQuote();
    }, [data.quote, onDataChange]);
    
    const handleAcceptChallenge = async () => {
        setIsLoading(true);
        try {
            const newChallenges = await getSalesChallenges();
            const challengesWithIds = newChallenges.map((text, i) => ({ id: `${Date.now()}-${i}`, text }));
            onDataChange({ ...data, challenges: challengesWithIds, challengesAccepted: true, completedChallenges: [] });
            onWin('AI Daily Challenge Accepted!');
        } catch (error) {
            console.error("Failed to fetch challenges:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCompleteChallenge = (challengeId: string, challengeText: string) => {
        if (data.completedChallenges.includes(challengeId)) return; // Already completed

        const newCompleted = [...data.completedChallenges, challengeId];
        onDataChange({ ...data, completedChallenges: newCompleted });
        onWin(`Challenge Completed: ${challengeText}`);
    };


    return (
        <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray relative">
            <h3 className="text-lg font-bold mb-4 bg-brand-gray/80 text-white p-2 rounded text-center">DAILY AI CHALLENGE</h3>
            
            {isLoading && !data.challengesAccepted ? (
                <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-center">
                        <p className="italic text-brand-light-text dark:text-gray-300">"{data.quote?.text}"</p>
                        <p className="font-semibold text-sm text-gray-500 dark:text-gray-400 mt-1">- {data.quote?.author}</p>
                    </div>

                    {!data.challengesAccepted ? (
                        <div className="text-center">
                            <p className="mb-3 font-semibold text-brand-light-text dark:text-white">Are you ready to take massive action today?</p>
                            <button
                                onClick={handleAcceptChallenge}
                                disabled={isLoading}
                                className="bg-brand-red text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition w-full disabled:bg-brand-gray"
                            >
                                {isLoading ? 'Generating...' : 'Challenge Accepted'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h4 className="font-bold text-center text-brand-light-text dark:text-white">Your Challenges:</h4>
                            {data.challenges.map(challenge => (
                                <div key={challenge.id} className="flex items-center space-x-3">
                                    <input 
                                        type="checkbox"
                                        id={`challenge-${challenge.id}`}
                                        checked={data.completedChallenges.includes(challenge.id)}
                                        onChange={() => handleCompleteChallenge(challenge.id, challenge.text)}
                                        className="h-5 w-5 rounded bg-brand-light-border dark:bg-brand-gray border-gray-300 dark:border-gray-600 text-brand-lime focus:ring-brand-lime"
                                    />
                                    <label htmlFor={`challenge-${challenge.id}`} className={`text-sm ${data.completedChallenges.includes(challenge.id) ? 'line-through text-gray-500' : 'text-brand-light-text dark:text-gray-300'}`}>
                                        {challenge.text}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AIChallengeCard;