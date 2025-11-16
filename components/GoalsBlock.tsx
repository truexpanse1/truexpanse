import React from 'react';
import { Goal } from '../types';

interface GoalsBlockProps {
    title: string;
    goals: Goal[];
    onGoalChange: (goal: Goal, isCompletion: boolean) => void;
    highlight?: boolean;
}

const GoalsBlock: React.FC<GoalsBlockProps> = ({ title, goals, onGoalChange, highlight }) => {
    
    const handleCompletionToggle = (goal: Goal) => {
        const isCompleting = !goal.completed;
        const updatedGoal = { ...goal, completed: isCompleting };
        onGoalChange(updatedGoal, isCompleting);
    };
    
    return (
        <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
            <h3 className={`text-sm font-bold uppercase mb-2 ${highlight ? 'text-brand-red' : 'text-gray-600 dark:text-gray-300'}`}>{title}</h3>
            <div className="space-y-2">
                {goals.map((goal) => (
                    <div key={goal.id} className="flex items-center space-x-3">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={goal.completed}
                                onChange={() => handleCompletionToggle(goal)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 dark:border-gray-600 checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            />
                            {/* Custom checkmark SVG that appears when checked */}
                            <svg
                                className="absolute w-5 h-5 pointer-events-none hidden peer-checked:block text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            value={goal.text}
                            onChange={(e) => onGoalChange({ ...goal, text: e.target.value }, false)}
                            className={`w-full bg-transparent border-b border-dashed border-brand-light-border dark:border-brand-gray text-brand-light-text dark:text-white text-sm p-1 focus:outline-none focus:border-brand-blue focus:border-solid ${goal.completed ? 'line-through text-gray-500' : ''}`} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalsBlock;
