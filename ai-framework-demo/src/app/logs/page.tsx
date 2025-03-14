'use client';

import { useState, useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  useCase: {
    action: string;
    useCase: {
      name: string;
      description: string;
      impact: number;
      effort: number;
      id: number;
      implementationType: string;
    };
  };
  ip: string;
  userAgent: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchLogs = async (key: string) => {
    if (!key.trim()) {
      setError('Secret key is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch logs with the secret key
      const response = await fetch(`/api/logs?key=${encodeURIComponent(key)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch logs');
      }
      
      setLogs(data.logs || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(secretKey);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">AI Prioritization Framework - Logs</h1>
      
      {!authenticated ? (
        <div className="max-w-md mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              This page requires a secret key to access logs.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secretKey">
                Secret Key
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="secretKey"
                type="password"
                placeholder="Enter your secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View Logs'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Use Case Logs</h2>
            <div className="flex gap-4">
              <button
                onClick={() => fetchLogs(secretKey)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => setAuthenticated(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg">Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-lg text-gray-600">No logs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Use Case
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Impact/Effort
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${log.useCase.action === 'add_use_case' ? 'bg-green-100 text-green-800' : 
                            log.useCase.action === 'edit_use_case' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {log.useCase.action === 'add_use_case' ? 'Added' : 
                           log.useCase.action === 'edit_use_case' ? 'Edited' : 'Deleted'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{log.useCase.useCase.name}</div>
                        <div className="text-sm text-gray-500">{log.useCase.useCase.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Impact: {log.useCase.useCase.impact}/10</div>
                        <div>Effort: {log.useCase.useCase.effort}/10</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {log.useCase.useCase.implementationType}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 