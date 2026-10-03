"use client";

import React, { useEffect, useState } from 'react';
import { surveyData } from '../data';

type SurveyResponse = {
  id: string;
  name?: string;
  timestamp: string;
  answers: Record<string, string>;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [password, setPassword] = useState('');
  
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetch('/api/survey')
      .then(res => res.json())
      .then(data => {
        setResponses(data.responses || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load responses");
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel max-w-sm w-full p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">Admin Access</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === 'admin123') {
              setIsAuthenticated(true);
              localStorage.setItem('admin_authenticated', 'true');
            } else {
              alert('Incorrect password');
              setPassword('');
            }
          }}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-4"
            />
            <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel px-8 py-4 rounded-xl text-foreground font-medium flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-xl text-center shadow-xl">
          <div className="text-red-500 font-medium mb-2 text-xl">Error</div>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const totalResponses = responses.length;

  if (selectedResponse) {
    return (
      <div className="min-h-screen p-6 sm:p-12 relative">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <button 
              onClick={() => setSelectedResponse(null)}
              className="p-2 bg-slate-200/50 hover:bg-slate-300/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Response Details</h1>
              <p className="text-slate-500 dark:text-slate-400">
                Submitted by {selectedResponse.name || 'Anonymous'} on {new Date(selectedResponse.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden shadow-xl p-6 sm:p-8 space-y-8">
            {surveyData.questions.map((q, index) => {
              const answerId = selectedResponse.answers[q.id];
              const selectedOption = q.options.find(o => o.id === answerId);
              
              return (
                <div key={q.id} className="border-b border-slate-200/50 dark:border-slate-700/50 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    {index + 1}. {q.title.replace(/^\d+\.\s*/, '')}
                  </h3>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      {selectedOption ? selectedOption.label : <span className="italic text-slate-400">Not answered</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-6 sm:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Overview of collected survey responses.</p>
          </div>
          <a 
            href="/"
            className="px-6 py-2 bg-slate-200/50 hover:bg-slate-300/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 text-foreground font-medium rounded-lg transition-colors inline-flex items-center space-x-2 text-sm"
          >
            <span>View Survey</span>
          </a>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500 shadow-lg">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Completions</h3>
            <div className="text-4xl font-bold text-foreground">{totalResponses}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-purple-500 shadow-lg">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Active Questions</h3>
            <div className="text-4xl font-bold text-foreground">{surveyData.questions.length}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500 shadow-lg">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Latest Response</h3>
            <div className="text-lg font-bold text-foreground mt-2 truncate">
              {responses.length > 0 
                ? new Date(responses[responses.length - 1].timestamp).toLocaleString()
                : 'No data yet'
              }
            </div>
          </div>
        </div>

        {/* Responses Table */}
        <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Recent Submissions</h2>
          </div>
          <div className="overflow-x-auto">
            {responses.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                No surveys have been submitted yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-white/30 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b border-slate-200/50 dark:border-slate-700/50">Submission ID</th>
                    <th className="p-4 font-semibold border-b border-slate-200/50 dark:border-slate-700/50">Name</th>
                    <th className="p-4 font-semibold border-b border-slate-200/50 dark:border-slate-700/50">Date & Time</th>
                    <th className="p-4 font-semibold border-b border-slate-200/50 dark:border-slate-700/50 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  {responses.slice().reverse().map((response) => {
                    const answeredCount = Object.keys(response.answers).length;
                    const totalCount = surveyData.questions.length;
                    const isComplete = answeredCount === totalCount;
                    
                    return (
                      <tr 
                        key={response.id} 
                        onClick={() => setSelectedResponse(response)}
                        className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="p-4 text-sm font-mono text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">#{response.id.slice(-6)}</td>
                        <td className="p-4 text-sm font-medium text-foreground">{response.name || 'Anonymous'}</td>
                        <td className="p-4 text-sm text-foreground">
                          {new Date(response.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 text-sm text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${isComplete 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                            }`}
                          >
                            {answeredCount} / {totalCount} answered
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
