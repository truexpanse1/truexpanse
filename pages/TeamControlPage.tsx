import React, { useState } from 'react';
import { User } from '../types';
import AddUserModal from '../components/AddUserModal';

interface TeamControlPageProps {
  users: User[];
  onViewUserTrends: (userId: string) => void;
}

const TeamControlPage: React.FC<TeamControlPageProps> = ({ users, onViewUserTrends }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleActionNotImplemented = () => {
        alert("This action is not available in the demo. User management should be handled securely via the Supabase dashboard or a backend function.");
    };

    return (
        <>
            <div className="bg-brand-light-card dark:bg-brand-navy p-6 rounded-lg border border-brand-light-border dark:border-brand-gray">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-brand-light-text dark:text-white">Team Control Panel</h1>
                    <button
                        onClick={handleActionNotImplemented}
                        className="bg-brand-lime text-brand-ink font-bold py-2 px-4 rounded-lg hover:bg-green-400 transition text-sm"
                    >
                        + Add User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left table-auto">
                        <thead className="bg-brand-light-bg dark:bg-brand-gray/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-brand-light-border dark:border-brand-gray text-brand-light-text dark:text-gray-300">
                                    <td className="p-3 font-medium">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-brand-lime/20 text-brand-lime' : 'bg-brand-gray/50 text-gray-400'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center space-x-2">
                                        <button onClick={() => onViewUserTrends(user.id)} className="text-xs text-lime-500 hover:underline">Trends</button>
                                        <button onClick={handleActionNotImplemented} className="text-xs text-blue-400 hover:underline">Edit</button>
                                        <button onClick={handleActionNotImplemented} className="text-xs text-yellow-500 hover:underline">Reset Pass</button>
                                        <button onClick={handleActionNotImplemented} className={`text-xs hover:underline ${user.status === 'Active' ? 'text-red-400' : 'text-green-400'}`}>
                                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TeamControlPage;