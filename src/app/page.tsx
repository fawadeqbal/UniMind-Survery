"use client";

import React, { useState } from 'react';

// Custom SVG Icons
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

import { surveyData } from './data';
const { title, description, note, questions } = surveyData;

export default function SurveyPage() {
  const [view, setView] = useState<'intro' | 'survey' | 'completed'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const question = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  const handleSelect = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionId
    }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        await fetch('/api/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, answers })
        });
      } catch (error) {
        console.error("Submission error:", error);
      }
      setIsSubmitting(false);
      setView('completed');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      setView('intro');
    }
  };

  if (view === 'intro') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <div className="glass-panel max-w-lg w-full rounded-2xl p-10 text-center">
          <div className="mx-auto w-14 h-14 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white leading-tight">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4 leading-relaxed whitespace-pre-line">
            {description}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-8 italic">
            {note}
          </p>
          <div className="mb-8 text-left">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Please enter your name to begin:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>
          <button 
            onClick={() => setView('survey')}
            disabled={!name.trim()}
            className={`px-8 py-3.5 font-medium rounded-lg transition-all duration-200 w-full text-base flex items-center justify-center space-x-2 group
              ${name.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
          >
            <span>Start Survey</span>
            <div className={`transform transition-transform ${name.trim() ? 'group-hover:translate-x-1' : ''}`}>
              <ArrowRightIcon />
            </div>
          </button>
        </div>
      </main>
    );
  }

  if (view === 'completed') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <div className="glass-panel max-w-lg w-full rounded-2xl p-10 text-center">
          <div className="mx-auto w-20 h-20 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Thank You!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Your responses have been successfully recorded. We appreciate you taking the time to share your insights with us.
          </p>
          <button 
            onClick={() => {
              setView('intro');
              setCurrentStep(0);
              setAnswers({});
              setName('');
            }}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Take another survey
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-900">
      <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden relative">
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 absolute top-0 left-0">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8 sm:p-12 pt-10">
          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider text-xs sm:text-sm uppercase block mb-1 sm:mb-0">
                {question.section}
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-medium text-sm">
                Question {currentStep + 1} of {questions.length}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-2 leading-tight">
              {question.title}
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-12">
            {question.options.map((option) => {
              const isSelected = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-150 flex items-center justify-between group
                    ${isSelected 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 ring-1 ring-indigo-500' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <span className={`text-base sm:text-lg font-medium transition-colors ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {option.label}
                  </span>
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150
                    ${isSelected 
                      ? 'border-indigo-600 bg-indigo-600 text-white' 
                      : 'border-slate-300 dark:border-slate-500 group-hover:border-indigo-400'
                    }`}
                  >
                    {isSelected && <CheckIcon />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handlePrev}
              className="flex items-center space-x-2 px-4 py-2 font-medium transition-colors text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <ArrowLeftIcon />
              <span>{currentStep === 0 ? 'Back to Intro' : 'Previous'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[question.id] || isSubmitting}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200
                ${answers[question.id] && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
            >
              <span>{isSubmitting ? 'Submitting...' : currentStep === questions.length - 1 ? 'Complete Survey' : 'Next Question'}</span>
              {currentStep < questions.length - 1 && !isSubmitting && <ArrowRightIcon />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
