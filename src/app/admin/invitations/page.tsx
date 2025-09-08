'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Invitation {
  id: string;
  email: string;
  role: 'ADMIN' | 'REVIEWER' | 'AUTHOR';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
}

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'AUTHOR' as 'ADMIN' | 'REVIEWER' | 'AUTHOR'
  });
  const [submitting, setSubmitting] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    if (session.user.role !== 'ADMIN') {
      router.push('/auth/unauthorized');
      return;
    }
    fetchInvitations();
  }, [session, status, router]);

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/admin/invitations');
      if (!response.ok) {
        throw new Error('Failed to fetch invitations');
      }
      const data = await response.json();
      setInvitations(data.invitations);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch invitations');
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invitation');
      }

      // Reset form and refresh list
      setFormData({ email: '', role: 'AUTHOR' });
      setShowForm(false);
      fetchInvitations();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to delete this invitation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invitation');
      }

      // Refresh invitations list
      fetchInvitations();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete invitation');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-2 inline-block cursor-pointer"
                >
                  ← Back to Admin Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Invitation Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Send and manage user invitations
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {showForm ? 'Cancel' : 'Send Invitation'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Invitation Form */}
          {showForm && (
            <div className="mb-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Send New Invitation
              </h3>
              <form onSubmit={sendInvitation} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'AUTHOR' | 'REVIEWER' | 'ADMIN' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  >
                    <option value="AUTHOR">Author</option>
                    <option value="REVIEWER">Reviewer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? 'Sending...' : 'Send Invitation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Invitations Table */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                All Invitations ({invitations.length})
              </h3>
              
              {invitations.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No invitations found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Expires
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {invitations.map((invitation) => (
                        <tr key={invitation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {invitation.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              {invitation.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              invitation.status === 'PENDING' 
                                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                : invitation.status === 'ACCEPTED'
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {invitation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(invitation.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(invitation.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteInvitation(invitation.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
