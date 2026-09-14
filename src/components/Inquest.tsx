import React, { useState } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  RotateCcw, 
  FileCode 
} from 'lucide-react';
import { INQUEST_QUESTIONS, computeInquestResults, getInquestRecommendations } from '../lib/inquest';
import { InquestState, AppView } from '../lib/types';
import { saveInquestState } from '../lib/session';
import { voiceConduit } from '../lib/voice';

interface InquestProps {
  initialState: InquestState | null;
  onComplete: (state: InquestState) => void;
  onNavigate: (view: AppView) => void;
}

export const Inquest: React.FC<InquestProps> = ({
  initialState,
  onComplete,
  onNavigate
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(initialState?.currentStageIndex || 0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialState?.answers || {
    'inq-intent-1': 'opt-autonomous-copilot',
    'inq-arch-2': 'opt-hierarchical-hybrid',
    'inq-governance-3': 'opt-tri-gate-sentry',
    'inq-mcp-4': 'opt-stdio-sse-mesh'
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(initialState?.isCompleted || false);

  const currentQuestion = INQUEST_QUESTIONS[currentIdx];
  const scores = computeInquestResults(answers);
  const recommendations = getInquestRecommendations(answers);

  const handleSelectOption = (questionId: string, optionId: string) => {
    const updated = { ...answers, [questionId]: optionId };
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIdx < INQUEST_QUESTIONS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      voiceConduit.speak(`Advancing to stage ${nextIdx + 1}: ${INQUEST_QUESTIONS[nextIdx].category}.`);
    } else {
      finalizeInquest();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const finalizeInquest = () => {
    const finalState: InquestState = {
      currentStageIndex: currentIdx,
      answers,
      isCompleted: true,
      score: scores,
      recommendations
    };
    setIsCompleted(true);
    saveInquestState(finalState);
    onComplete(finalState);
    voiceConduit.speak("Inquest diagnostic complete. System integrity and governance covenants calculated.");
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-cyber text-amber-400 mb-1">
            <Activity className="w-4 h-4" />
            <span>ARCHITECTURAL &amp; GOVERNANCE INQUEST</span>
          </div>
          <h2 className="font-cyber text-2xl sm:text-3xl font-bold text-neutral-100">
            System Posture &amp; Autonomy Diagnostic
          </h2>
          <p className="text-xs text-neutral-400 font-mono-cyber mt-1">
            Stage {currentIdx + 1} of {INQUEST_QUESTIONS.length} // Configure multi-agent topology, memory depth, and MCP boundaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded text-xs font-mono-cyber text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-neutral-750 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {isCompleted && (
            <button
              onClick={() => onNavigate('deliverables')}
              className="px-4 py-1.5 rounded text-xs font-cyber font-bold tracking-wider bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>View Generated Deliverables</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Stage Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {INQUEST_QUESTIONS.map((q, idx) => {
          const isActive = idx === currentIdx;
          const isAnswered = !!answers[q.id];
          return (
            <div
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                  : isAnswered
                  ? 'bg-neutral-900/60 border-neutral-750 text-neutral-300 hover:border-neutral-600'
                  : 'bg-neutral-950/40 border-neutral-850 text-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono-cyber mb-1">
                <span>STAGE 0{idx + 1}</span>
                {isAnswered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-xs font-cyber font-medium truncate">
                {q.category.split('&')[0]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid: Question on Left, Live Scoreboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Question and Options */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-4">
            <div className="inline-block px-2.5 py-1 bg-neutral-800 rounded text-[10px] font-mono-cyber text-amber-400 tracking-wider">
              {currentQuestion.category.toUpperCase()}
            </div>
            <h3 className="font-cyber text-xl font-bold text-neutral-100">
              {currentQuestion.question}
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              {currentQuestion.subtitle}
            </p>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400/80 shadow-lg shadow-amber-500/10'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-neutral-600'}`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />}
                          </span>
                          <h4 className="font-cyber font-semibold text-sm text-neutral-100">
                            {opt.label}
                          </h4>
                          {opt.recommended && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-cyber font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 pl-5 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-neutral-900 border border-neutral-750 text-amber-300">
                          {opt.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className={`px-4 py-2 rounded-lg text-xs font-cyber font-semibold tracking-wider flex items-center gap-1.5 transition-colors ${
                  currentIdx === 0
                    ? 'text-neutral-600 cursor-not-allowed'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>PREVIOUS STAGE</span>
              </button>

              <button
                id="inquest-next-btn"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg text-xs font-cyber font-bold tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <span>{currentIdx === INQUEST_QUESTIONS.length - 1 ? 'SEAL & FINALIZE' : 'NEXT STAGE'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-time Scoring & Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          {/* Posture Scoreboard */}
          <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-4">
            <h4 className="font-cyber font-bold text-sm tracking-wider text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              DYNAMIC INTEGRITY GAUGES
            </h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono-cyber mb-1">
                  <span className="text-neutral-400">Architectural Rigor</span>
                  <span className="text-amber-400 font-bold">{scores.architecturalRigor}%</span>
                </div>
                <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
                    style={{ width: `${scores.architecturalRigor}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-cyber mb-1">
                  <span className="text-neutral-400">Governance Readiness</span>
                  <span className="text-cyan-400 font-bold">{scores.governanceReadiness}%</span>
                </div>
                <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${scores.governanceReadiness}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-cyber mb-1">
                  <span className="text-neutral-400">MCP Tool Capability</span>
                  <span className="text-purple-400 font-bold">{scores.mcpCapability}%</span>
                </div>
                <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300"
                    style={{ width: `${scores.mcpCapability}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-cyber mb-1">
                  <span className="text-neutral-400">Security &amp; Sandboxing</span>
                  <span className="text-emerald-400 font-bold">{scores.securityIndex}%</span>
                </div>
                <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
                    style={{ width: `${scores.securityIndex}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Synthesized */}
          <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
            <h4 className="font-cyber font-bold text-sm tracking-wider text-neutral-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              SYNTHESIZED RECOMMENDATIONS
            </h4>

            <ul className="space-y-2.5">
              {recommendations.slice(0, 4).map((rec, rIdx) => (
                <li key={rIdx} className="text-xs text-neutral-300 font-mono-cyber flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-neutral-800">
              <button
                onClick={() => onNavigate('director')}
                className="w-full py-2 rounded-lg text-xs font-cyber font-semibold tracking-wider bg-neutral-800 hover:bg-neutral-750 text-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Map to Director Graph</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
