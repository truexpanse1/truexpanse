import React from 'react';
import { Goal } from '../types';

interface GoalsBlockProps {
    title: string;
    goals: Goal[];
    onGoalChange: (goal: Goal) => void;
    onGoalComplete?: (goal: Goal) => void;
    highlight?: boolean;
}

const GoalsBlock: React.FC<GoalsBlockProps> = ({ title, goals, onGoalChange, onGoalComplete, highlight }) => {
    
    const handleCompletionToggle = (goal: Goal) => {
        const wasCompleted = goal.completed;
        const updatedGoal = { ...goal, completed: !goal.completed };
        onGoalChange(updatedGoal);

        // Only trigger onGoalComplete when marking as complete for the first time
        if (!wasCompleted && updatedGoal.completed && onGoalComplete) {
            onGoalComplete(updatedGoal);
        }
    };
    
    return (
        <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
            <h3 className={`text-sm font-bold uppercase mb-2 ${highlight ? 'text-brand-red' : 'text-gray-600 dark:text-gray-300'}`}>{title}</h3>
            <div className="space-y-2">
                {goals.map((goal) => (
                    <div key={goal.id} className="flex items-center space-x-3">
                         <input
                            type="checkbox"
                            checked={goal.completed}
                            onChange={() => handleCompletionToggle(goal)}
                            className="h-5 w-5 rounded bg-brand-light-border dark:bg-brand-gray border-gray-300 dark:border-gray-600 text-brand-lime focus:ring-brand-lime"
                        />
                        <input 
                            type="text" 
                            value={goal.text}
                            onChange={(e) => onGoalChange({ ...goal, text: e.target.value })}
                            className={`w-full bg-transparent border-b border-dashed border-brand-light-border dark:border-brand-gray text-brand-light-text dark:text-white text-sm p-1 focus:outline-none focus:border-brand-blue focus:border-solid ${goal.completed ? 'line-through text-gray-500' : ''}`} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalsBlock;