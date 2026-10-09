"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { surveyData, type Question } from '../../data';

type SurveyResponse = {
  id: string;
  name?: string;
  timestamp: string;
  answers: Record<string, string>;
};

/* ------------------------------------------------------------------ */
/* Analysis configuration                                              */
/* ------------------------------------------------------------------ */

// Scale questions used to measure stress. Options are ordered either
// "most stressed first" (default) or "least stressed first" (reverse).
// A "high stress" answer is one of the two most-stressed options.
type Indicator = { id: string; label: string; finding: string; reverse?: boolean };

const INDICATORS: Indicator[] = [
  { id: 'q4', label: 'Mental exhaustion', finding: 'feel mentally exhausted often or very often after a day at university' },
  { id: 'q8', label: 'Disrupted plans', finding: 'have their daily plans disturbed by unexpected academic tasks often or very often' },
  { id: 'q10', label: 'Guilt when resting', finding: 'often or almost always feel guilty when they take time off from studying' },
  { id: 'q12', label: 'Worry about the future', finding: 'worry about their academic future daily or several times a week' },
  { id: 'q13', label: 'Efforts feel insufficient', finding: 'often or very often feel their efforts are not enough, even after hours of study' },
  { id: 'q14', label: 'Mood affected off-campus', finding: 'say academic pressure often or very often affects their mood outside university' },
  { id: 'q16', label: 'Peer comparison', finding: 'are affected quite a lot or a great deal by comparing themselves with classmates' },
  { id: 'q21', label: 'GPA pressure', finding: 'feel high or extremely high pressure to maintain a certain GPA' },
  { id: 'q24', label: 'Sleep sacrifice', finding: 'sacrifice sleep often or very often to complete academic tasks' },
  { id: 'q27', label: 'No time for interests', finding: 'often or very often feel they have no time for their interests because of studies' },
  { id: 'q6', label: 'Course pace', finding: 'are uncomfortable with the pace at which their courses are taught', reverse: true },
  { id: 'q19', label: 'Silence with family', finding: 'are uncomfortable sharing academic difficulties with their family', reverse: true },
  { id: 'q26', label: 'Low workload confidence', finding: 'are not confident in managing their academic workload', reverse: true },
  { id: 'q28', label: 'Teacher approachability', finding: 'find their teachers not approachable when facing difficulties', reverse: true },
];

// Multiple-choice "what / which" questions that describe the causes of stress.
const DRIVERS: { id: string; heading: string }[] = [
  { id: 'q15', heading: 'How students feel lately' },
  { id: 'q30', heading: 'Hidden pressure to remove' },
  { id: 'q5', heading: 'Biggest energy drain' },
  { id: 'q9', heading: 'Least confident situation' },
  { id: 'q22', heading: 'Main study distraction' },
  { id: 'q17', heading: 'Strongest expectations' },
  { id: 'q23', heading: 'Response to overwhelm' },
  { id: 'q11', heading: 'Reaction to a low grade' },
  { id: 'q29', heading: 'Most wanted support' },
];

type Rec = { title: string; text: string };

// Recommendations keyed by the most-chosen option of a question.
const OPTION_RECS: Record<string, Rec> = {
  q29_1: { title: 'Strengthen academic advising', text: 'Students most want academic advising. Assign each student an advisor and schedule check-ins before mid-terms and finals.' },
  q29_2: { title: 'Expand counselling services', text: 'Counselling is the most requested service. Increase counsellor hours during exam periods and promote confidential drop-in sessions.' },
  q29_3: { title: 'Provide quiet study spaces', text: 'Quiet study spaces are the top request. Extend library hours and reserve silent zones during exam season.' },
  q29_4: { title: 'Launch peer study groups', text: 'Peer study groups are the top request. Set up mentor-led groups pairing senior and junior students per course.' },
  q29_5: { title: 'Improve online resources', text: 'Better online resources are the top request. Share recorded lectures, slides and practice questions for every course.' },
  q30_1: { title: 'Normalise failure as learning', text: 'Fear of failure is the pressure students most want gone. Offer resubmission chances and talk openly about setbacks in class.' },
  q30_2: { title: 'Reduce constant comparison', text: 'Constant comparison weighs heavily. Avoid public ranking of marks and emphasise individual progress feedback.' },
  q30_3: { title: 'Engage families', text: 'Family expectations are the leading hidden pressure. Hold parent orientation sessions about realistic academic expectations.' },
  q30_4: { title: 'Clarify career pathways', text: 'Uncertainty about the future dominates. Run career guidance sessions, alumni talks and internship information days.' },
  q30_5: { title: 'Challenge hustle culture', text: 'The pressure to always be productive is the top concern. Encourage scheduled breaks and spread deadlines evenly across the semester.' },
  q22_1: { title: 'Digital-wellbeing support', text: 'Phones and social media are the main distraction. Share focus techniques (e.g. Pomodoro, app blockers) in orientation and workshops.' },
  q22_2: { title: 'Address overthinking', text: 'Overthinking is the main distraction. Offer mindfulness and stress-management workshops through the counselling centre.' },
  q22_3: { title: 'Improve study environments', text: 'Noise and surroundings distract most. Designate quiet areas and improve conditions in study halls and hostels.' },
  q22_4: { title: 'Tackle fatigue', text: 'Tiredness is the main distraction. Review timetables to avoid overloaded days and promote healthy sleep routines.' },
  q22_5: { title: 'Flexibility for responsibilities', text: 'Personal responsibilities distract most. Offer flexible deadlines and recorded lectures for students with outside duties.' },
};

// Recommendations triggered when an indicator's high-stress rate is 40% or more.
const INDICATOR_RECS: Record<string, Rec> = {
  q24: { title: 'Protect student sleep', text: 'Many students give up sleep for coursework. Avoid midnight deadlines and coordinate assessment dates across courses.' },
  q8: { title: 'Announce tasks early', text: 'Unexpected tasks disrupt students. Publish an assessment calendar at the start of each semester.' },
  q28: { title: 'Make teachers more reachable', text: 'Teachers feel unapproachable to many. Set fixed office hours and open anonymous question channels.' },
  q19: { title: 'Open family conversations', text: 'Students struggle to talk to family about difficulties. Provide guidance and family outreach through student services.' },
  q21: { title: 'Ease GPA pressure', text: 'GPA pressure is high. Emphasise learning outcomes and clarify that one result does not define a career.' },
  q6: { title: 'Review teaching pace', text: 'Many find the course pace uncomfortable. Collect mid-semester feedback and add revision sessions.' },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const questionById = new Map<string, Question>(surveyData.questions.map(q => [q.id, q]));
const cleanTitle = (q: Question) => q.title.replace(/^\d+\.\s*/, '');
const pct = (v: number) => `${Math.round(v * 100)}%`;

function distribution(q: Question, responses: SurveyResponse[]) {
  const counts = q.options.map(o => ({ option: o, count: 0 }));
  let answered = 0;
  for (const r of responses) {
    const idx = q.options.findIndex(o => o.id === r.answers[q.id]);
    if (idx >= 0) { counts[idx].count++; answered++; }
  }
  const top = counts.reduce((a, b) => (b.count > a.count ? b : a), counts[0]);
  return { counts, answered, top };
}

// 0 = no stress, 1 = maximum stress, null when unanswered
function indicatorScore(ind: Indicator, r: SurveyResponse): number | null {
  const q = questionById.get(ind.id);
  if (!q) return null;
  const idx = q.options.findIndex(o => o.id === r.answers[ind.id]);
  if (idx < 0) return null;
  const n = q.options.length - 1;
  return ind.reverse ? idx / n : (n - idx) / n;
}

function personalIndex(r: SurveyResponse): number | null {
  const scores = INDICATORS.map(i => indicatorScore(i, r)).filter((s): s is number => s !== null);
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

const LEVELS = [
  { key: 'low', label: 'Low', max: 0.35, bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', soft: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { key: 'moderate', label: 'Moderate', max: 0.55, bar: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400', soft: 'bg-amber-50 dark:bg-amber-950/40' },
  { key: 'high', label: 'High', max: 0.75, bar: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', soft: 'bg-orange-50 dark:bg-orange-950/40' },
  { key: 'severe', label: 'Severe', max: 1.01, bar: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', soft: 'bg-rose-50 dark:bg-rose-950/40' },
];
const levelOf = (v: number) => LEVELS.find(l => v < l.max) ?? LEVELS[LEVELS.length - 1];

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */

function Bar({ value, highlight }: { value: number; highlight?: boolean }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
      <div
        className={`h-full rounded-full ${highlight ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-indigo-300 dark:bg-indigo-700'}`}
        style={{ width: `${Math.max(value * 100, value > 0 ? 2 : 0)}%` }}
      />
    </div>
  );
}

function OptionBars({ q, responses }: { q: Question; responses: SurveyResponse[] }) {
  const { counts, answered, top } = distribution(q, responses);
  return (
    <div className="space-y-2.5">
      {counts.map(({ option, count }) => {
        const share = answered ? count / answered : 0;
        const isTop = count > 0 && option.id === top.option.id;
        return (
          <div key={option.id}>
            <div className="flex justify-between gap-3 text-sm mb-1">
              <span className={isTop ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}>
                {option.label}
              </span>
              <span className="tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {count} · {pct(share)}
              </span>
            </div>
            <Bar value={share} highlight={isTop} />
          </div>
        );
      })}
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">{eyebrow}</div>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ConclusionPage() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      window.location.href = '/admin';
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    fetch('/api/survey')
      .then(res => res.json())
      .then(data => { setResponses(data.responses || []); setIsLoading(false); })
      .catch(err => { console.error(err); setError('Failed to load responses'); setIsLoading(false); });
  }, [isAuthorized]);

  const analysis = useMemo(() => {
    const total = responses.length;

    const indicators = INDICATORS.map(ind => {
      const q = questionById.get(ind.id)!;
      let answered = 0, high = 0, sum = 0;
      for (const r of responses) {
        const s = indicatorScore(ind, r);
        if (s === null) continue;
        answered++; sum += s;
        if (s >= 0.75) high++;
      }
      return { ...ind, section: q.section, answered, highRate: answered ? high / answered : 0, avg: answered ? sum / answered : 0 };
    }).sort((a, b) => b.highRate - a.highRate);

    const personal = responses.map(personalIndex).filter((v): v is number => v !== null);
    const overall = personal.length ? personal.reduce((a, b) => a + b, 0) / personal.length : 0;
    const levelCounts = LEVELS.map(l => ({ ...l, count: personal.filter(v => levelOf(v).key === l.key).length }));
    const highOrSevere = personal.length ? (levelCounts[2].count + levelCounts[3].count) / personal.length : 0;

    // Stress per survey section
    const sectionMap = new Map<string, number[]>();
    for (const i of indicators) {
      if (!i.answered) continue;
      sectionMap.set(i.section, [...(sectionMap.get(i.section) ?? []), i.avg]);
    }
    const sections = [...sectionMap.entries()]
      .map(([name, vals]) => ({ name: name.replace(/^Section \d+:\s*/, ''), value: vals.reduce((a, b) => a + b, 0) / vals.length }))
      .sort((a, b) => b.value - a.value);

    // Stress by a background question (semester, GPA)
    const segment = (qid: string) => {
      const q = questionById.get(qid)!;
      return q.options.map(o => {
        const group = responses.filter(r => r.answers[qid] === o.id).map(personalIndex).filter((v): v is number => v !== null);
        return { label: o.label, count: group.length, value: group.length ? group.reduce((a, b) => a + b, 0) / group.length : 0 };
      }).filter(s => s.count > 0);
    };

    const topOf = (qid: string) => {
      const q = questionById.get(qid)!;
      const d = distribution(q, responses);
      return { q, ...d, share: d.answered ? d.top.count / d.answered : 0 };
    };

    // Recommendations
    const recs: Rec[] = [];
    for (const qid of ['q29', 'q30', 'q22']) {
      const t = topOf(qid);
      const rec = t.top.count > 0 ? OPTION_RECS[t.top.option.id] : undefined;
      if (rec) recs.push(rec);
    }
    for (const i of indicators) {
      if (i.highRate >= 0.4 && INDICATOR_RECS[i.id]) recs.push(INDICATOR_RECS[i.id]);
    }

    const answeredAll = responses.filter(r => surveyData.questions.every(q => r.answers[q.id])).length;

    return {
      total, indicators, overall, levelCounts, highOrSevere, sections,
      bySemester: segment('q1'), byGpa: segment('q3'),
      topOf, recs: recs.slice(0, 6), answeredAll,
    };
  }, [responses]);

  if (isAuthorized === null || isAuthorized === false) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <div className="glass-panel px-8 py-4 rounded-lg text-slate-700 dark:text-slate-300 font-medium flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Analysing responses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <div className="glass-panel p-8 rounded-lg text-center">
          <div className="text-red-500 font-medium mb-2 text-xl">Error</div>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const { total, indicators, overall, levelCounts, highOrSevere, sections, bySemester, byGpa, topOf, recs, answeredAll } = analysis;
  const level = levelOf(overall);
  const feeling = topOf('q15');
  const pressure = topOf('q30');
  const support = topOf('q29');
  const distraction = topOf('q22');
  const energy = topOf('q5');
  const expectations = topOf('q17');
  const topIndicators = indicators.filter(i => i.answered > 0).slice(0, 4);

  const sectionsGrouped = surveyData.questions.reduce<Record<string, Question[]>>((acc, q) => {
    (acc[q.section] ??= []).push(q);
    return acc;
  }, {});

  const header = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <a
          href="/admin"
          aria-label="Back to dashboard"
          className="print:hidden p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </a>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">Survey Conclusion</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{surveyData.title}</p>
        </div>
      </div>
      {total > 0 && (
        <button
          onClick={() => window.print()}
          className="print:hidden px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2 text-sm shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Print / Save PDF</span>
        </button>
      )}
    </div>
  );

  if (total === 0) {
    return (
      <div className="min-h-screen p-6 sm:p-12 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto space-y-8">
          {header}
          <div className="glass-panel rounded-xl p-12 text-center text-slate-400">
            No responses yet. The conclusion will appear once students submit the survey.
          </div>
        </div>
      </div>
    );
  }

  const ringRadius = 52;
  const ringLength = 2 * Math.PI * ringRadius;

  return (
    <div className="min-h-screen p-6 sm:p-12 bg-slate-50 dark:bg-slate-900 print:bg-white print:p-0">
      <div className="max-w-6xl mx-auto space-y-10">
        {header}

        {/* Hero: overall stress */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r={ringRadius} fill="none" strokeWidth="10" className="stroke-slate-100 dark:stroke-slate-700" />
                <circle
                  cx="60" cy="60" r={ringRadius} fill="none" strokeWidth="10" strokeLinecap="round"
                  className="stroke-indigo-600 dark:stroke-indigo-400"
                  strokeDasharray={ringLength}
                  strokeDashoffset={ringLength * (1 - overall)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">{Math.round(overall * 100)}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">out of 100</span>
              </div>
            </div>
            <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${level.soft} ${level.text}`}>
              {level.label} stress
            </span>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">Overall Academic Stress Index</div>
            <p className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 leading-relaxed">
              Across <strong>{total}</strong> {total === 1 ? 'student' : 'students'}, the average stress level is{' '}
              <strong className={level.text}>{level.label.toLowerCase()}</strong>.{' '}
              <strong>{pct(highOrSevere)}</strong> of respondents fall in the high or severe range, and the feeling chosen most
              often to describe academic life lately is <strong>&ldquo;{feeling.top.option.label}&rdquo;</strong> ({pct(feeling.share)}).
            </p>

            <div className="mt-6">
              <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                {levelCounts.map(l => l.count > 0 && (
                  <div key={l.key} className={l.bar} style={{ width: `${(l.count / total) * 100}%` }} title={`${l.label}: ${l.count}`} />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-slate-600 dark:text-slate-300">
                {levelCounts.map(l => (
                  <span key={l.key} className="inline-flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${l.bar}`} />
                    {l.label}: <strong className="tabular-nums">{l.count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Respondents', value: String(total), accent: 'border-l-indigo-600' },
            { label: 'Fully completed', value: pct(answeredAll / total), accent: 'border-l-violet-500' },
            { label: 'Top hidden pressure', value: pressure.top.option.label, accent: 'border-l-rose-500' },
            { label: 'Most wanted support', value: support.top.option.label, accent: 'border-l-sky-500' },
          ].map(s => (
            <div key={s.label} className={`glass-panel p-5 rounded-xl border-l-4 ${s.accent}`}>
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{s.label}</h3>
              <div className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Key findings */}
        <section>
          <SectionTitle eyebrow="Key findings" title="What the responses tell us" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topIndicators.map((i, idx) => (
              <div key={i.id} className="glass-panel rounded-xl p-5 flex gap-4">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums min-w-[4.5rem]">{pct(i.highRate)}</div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">Finding {idx + 1}</div>
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">of students {i.finding}.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stress indicators + sections */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel rounded-xl p-6 lg:col-span-2">
            <SectionTitle eyebrow="Stress indicators" title="Share of students reporting high stress" subtitle="Percentage choosing one of the two most stressful answers." />
            <div className="space-y-3.5">
              {indicators.filter(i => i.answered > 0).map(i => {
                const l = levelOf(i.highRate);
                return (
                  <div key={i.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 dark:text-slate-200">{i.label}</span>
                      <span className={`tabular-nums font-semibold ${l.text}`}>{pct(i.highRate)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div className={`h-full rounded-full ${l.bar}`} style={{ width: `${i.highRate * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-6">
              <SectionTitle eyebrow="By area" title="Stress by survey section" />
              <div className="space-y-4">
                {sections.map(s => {
                  const l = levelOf(s.value);
                  return (
                    <div key={s.name}>
                      <div className="flex justify-between gap-3 text-sm mb-1">
                        <span className="text-slate-700 dark:text-slate-200">{s.name}</span>
                        <span className={`tabular-nums font-semibold ${l.text}`}>{Math.round(s.value * 100)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div className={`h-full rounded-full ${l.bar}`} style={{ width: `${s.value * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="glass-panel rounded-xl p-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="font-semibold text-slate-900 dark:text-white mb-1">How the index works</div>
              Each of the {INDICATORS.length} scale questions is scored from 0 (no stress) to 100 (maximum stress) and averaged
              per student. Low &lt; 35, Moderate 35–54, High 55–74, Severe 75+.
            </div>
          </div>
        </section>

        {/* Drivers */}
        <section>
          <SectionTitle eyebrow="Root causes" title="What drives the stress" subtitle="The most common answer to each question is highlighted." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DRIVERS.map(d => {
              const t = topOf(d.id);
              return (
                <div key={d.id} className="glass-panel rounded-xl p-6 break-inside-avoid">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{d.heading}</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.answered ? t.top.option.label : '—'}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{cleanTitle(t.q)}</p>
                  <OptionBars q={t.q} responses={responses} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Segments */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Stress by semester', data: bySemester },
            { title: 'Stress by previous GPA', data: byGpa },
          ].map(seg => (
            <div key={seg.title} className="glass-panel rounded-xl p-6">
              <SectionTitle eyebrow="Comparison" title={seg.title} subtitle="Average stress index (0–100) per group." />
              {seg.data.length === 0 ? (
                <p className="text-sm text-slate-400">Not enough data.</p>
              ) : (
                <div className="space-y-3">
                  {seg.data.map(s => {
                    const l = levelOf(s.value);
                    return (
                      <div key={s.label} className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-sm">
                        <span className="text-slate-700 dark:text-slate-200 truncate">{s.label}</span>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div className={`h-full rounded-full ${l.bar}`} style={{ width: `${s.value * 100}%` }} />
                        </div>
                        <span className="text-right tabular-nums text-slate-500 dark:text-slate-400">
                          <strong className={l.text}>{Math.round(s.value * 100)}</strong> <span className="text-xs">n={s.count}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Recommendations */}
        {recs.length > 0 && (
          <section>
            <SectionTitle eyebrow="Recommendations" title="Suggested actions for the university" subtitle="Generated from the most common answers and the highest-stress areas." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recs.map((r, i) => (
                <div key={r.title} className="glass-panel rounded-xl p-5 break-inside-avoid">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold mb-3">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{r.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Final conclusion */}
        <section className="rounded-2xl p-6 sm:p-8 bg-indigo-600 text-white print:bg-white print:text-slate-900 print:border print:border-slate-300">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-200 print:text-indigo-600 mb-2">Conclusion</div>
          <h2 className="text-2xl font-bold mb-4">Beyond the books: the hidden weight of academic life</h2>
          <div className="space-y-3 leading-relaxed text-indigo-50 print:text-slate-700">
            <p>
              Based on {total} {total === 1 ? 'response' : 'responses'}, university students experience a{' '}
              <strong className="text-white print:text-slate-900">{level.label.toLowerCase()}</strong> level of academic stress
              (index {Math.round(overall * 100)}/100). The strongest signals are{' '}
              {topIndicators.slice(0, 3).map((i, idx, arr) => (
                <React.Fragment key={i.id}>
                  <strong className="text-white print:text-slate-900">{i.label.toLowerCase()}</strong> ({pct(i.highRate)})
                  {idx < arr.length - 2 ? ', ' : idx === arr.length - 2 ? ' and ' : ''}
                </React.Fragment>
              ))}
              {sections[0] && <>, with <strong className="text-white print:text-slate-900">{sections[0].name.toLowerCase()}</strong> emerging as the most stressful area</>}.
            </p>
            <p>
              The pressure is not only about coursework. <strong className="text-white print:text-slate-900">{energy.top.option.label}</strong> drains
              the most energy, <strong className="text-white print:text-slate-900">{distraction.top.option.label.toLowerCase()}</strong> is the main
              distraction, and decisions are shaped most by <strong className="text-white print:text-slate-900">{expectations.top.option.label.toLowerCase()}</strong> expectations.
              Given the chance, students would most like to remove <strong className="text-white print:text-slate-900">{pressure.top.option.label.toLowerCase()}</strong> from university life.
            </p>
            <p>
              Students point to <strong className="text-white print:text-slate-900">{support.top.option.label.toLowerCase()}</strong> as the
              support that would help most. Acting on this, alongside the recommendations above, would address the hidden causes of
              stress identified in this survey and help students perform better while staying well.
            </p>
          </div>
        </section>

        {/* Full results */}
        <section>
          <SectionTitle eyebrow="Appendix" title="Full results by question" subtitle="Expand a section to see every answer distribution." />
          <div className="space-y-4">
            {Object.entries(sectionsGrouped).map(([section, qs]) => (
              <details key={section} className="glass-panel rounded-xl group">
                <summary className="cursor-pointer list-none p-5 flex justify-between items-center font-semibold text-slate-900 dark:text-white">
                  <span>{section}</span>
                  <span className="text-slate-400 text-sm font-normal group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-5 pb-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 border-t border-slate-100 dark:border-slate-700 pt-6">
                  {qs.map(q => (
                    <div key={q.id} className="break-inside-avoid">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">{q.title}</h3>
                      <OptionBars q={q} responses={responses} />
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-slate-400 pb-4">
          Generated {new Date().toLocaleString()} from {total} responses · {surveyData.note}
        </p>
      </div>
    </div>
  );
}
