import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

interface TeamControlPageProps {
  users: User[];
  onViewUserTrends: (userId: string) => void;
  currentUserCompanyId?: string; // optional — we'll get from session if needed
}

const TeamControlPage: React.FC<TeamControlPageProps> = ({ users, onViewUserTrends }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleSaveNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = (formData.get('role') as string) || 'Sales Rep';

    try {
      // 1. Create auth user in Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: Math.random().toString(36).slice(-10) + 'Ab1!', // strong temp password
        email_confirm: true,
      });

      if (authError) throw authError;

      // 2. Add user profile to your 'users' table
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        name,
        email,
        role,
        status: 'Active',
        company_id: (window as any).currentUserCompanyId || 'default-company', // fallback
      });

      if (profileError) throw profileError;

      alert(`User "${name}" added successfully!\n\nThey can now log in with:\nEmail: ${email}\n(You should send them a password reset link)`);

      setIsModalOpen(false);
      window.location.reload(); // refresh list
    } catch (err: any) {
      alert('Failed to add user: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black">Team Control Panel</h1>
          <button
            onClick={handleAddUser}
            className="bg-brand-green hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
          >
            + Add User
          </button>
        </div>

        {/* Users Table */}
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
                <tr
                  key={user.id}
                  className="border-b border-brand-light-border dark:border-brand-gray text-brand-light-text dark:text-gray-300"
                >
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Active'
                          ? 'bg-brand-lime/20 text-brand-lime'
                          : 'bg-brand-gray/50 text-gray-400'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => onViewUserTrends(user.id)} className="text-xs text-lime-500 hover:underline">
                      Trends
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal — FULLY WORKING */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-brand-navy rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Add New Team Member</h2>
            <form onSubmit={handleSaveNewUser}>
              <div className="space-y-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-brand-ink focus:border-blue-500 outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-brand-ink focus:border-blue-500 outline-none"
                />
                <select
                  name="role"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-brand-ink focus:border-blue-500 outline-none"
                  defaultValue="Sales Rep"
                >
                  <option>Sales Rep</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-400 rounded-lg font-semibold"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-brand-green hover:bg-green-600 text-white font-bold rounded-lg transition disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamControlPage;
