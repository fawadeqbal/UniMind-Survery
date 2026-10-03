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
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel max-w-lg w-full rounded-3xl p-10 text-center transform transition-all duration-500 animate-in fade-in zoom-in-95 shadow-2xl relative z-10">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-8 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-foreground leading-tight">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4 leading-relaxed whitespace-pre-line">
            {description}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-8 italic">
            {note}
          </p>
          <div className="mb-10 text-left">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Please enter your name to begin:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button 
            onClick={() => setView('survey')}
            disabled={!name.trim()}
            className={`px-8 py-4 font-medium rounded-xl transition-all duration-200 w-full text-lg flex items-center justify-center space-x-2 group
              ${name.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
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
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel max-w-lg w-full rounded-3xl p-10 text-center transform transition-all duration-500 animate-in fade-in zoom-in-95 shadow-2xl relative z-10">
          <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircleIcon />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Thank You!</h2>
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
            className="px-8 py-3 bg-foreground text-background font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-200 shadow-lg"
          >
            Take another survey
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10">
        {/* Top Progress Bar */}
        <div className="h-2 w-full bg-slate-200/50 dark:bg-slate-800/50 absolute top-0 left-0">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider text-xs sm:text-sm uppercase block mb-1 sm:mb-0">
                {question.section}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                Question {currentStep + 1} of {questions.length}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-2 leading-tight">
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
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                    ${isSelected 
                      ? 'border-blue-500 bg-white/50 dark:bg-blue-900/20 shadow-md transform scale-[1.01]' 
                      : 'border-white/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600/50 hover:bg-white/30 dark:hover:bg-slate-800/30 hover:scale-[1.01]'
                    }`}
                >
                  <span className={`text-base sm:text-lg font-medium transition-colors ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                    {option.label}
                  </span>
                  
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                    }`}
                  >
                    {isSelected && <CheckIcon />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={handlePrev}
              className="flex items-center space-x-2 px-4 py-2 font-medium transition-colors text-slate-600 dark:text-slate-300 hover:text-foreground"
            >
              <ArrowLeftIcon />
              <span>{currentStep === 0 ? 'Back to Intro' : 'Previous'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[question.id] || isSubmitting}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full font-medium transition-all duration-200
                ${answers[question.id] && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5'
                  : 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed'
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
