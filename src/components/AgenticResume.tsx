'use client';

import { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { Bot, Cpu, CheckCircle2, ShieldCheck, Gauge, Terminal, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function AgenticResume() {
  const [selectedQueryIdx, setSelectedQueryIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState('');

  const currentQuery = PORTFOLIO_DATA.agenticQueries[selectedQueryIdx];

  const runSimulation = (idx: number) => {
    setSelectedQueryIdx(idx);
    setIsExecuting(true);
    setActiveStep(0);
    setDisplayedResponse('');

    const targetQuery = PORTFOLIO_DATA.agenticQueries[idx];

    // Step-by-step LangGraph node traversal
    setTimeout(() => setActiveStep(1), 400);
    setTimeout(() => setActiveStep(2), 900);
    setTimeout(() => setActiveStep(3), 1400);

    setTimeout(() => {
      setActiveStep(4);
      setIsExecuting(false);
      // Stream in response
      let charIdx = 0;
      const fullText = targetQuery.response;
      const interval = setInterval(() => {
        setDisplayedResponse(fullText.slice(0, charIdx));
        charIdx += 4;
        if (charIdx > fullText.length + 4) {
          setDisplayedResponse(fullText);
          clearInterval(interval);
        }
      }, 15);
    }, 1800);
  };

  useEffect(() => {
    runSimulation(0);
  }, []);

  return (
    <section id="agentic-resume" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-14">
        
        <ScrollReveal className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-copper/30 text-xs font-mono text-copper-soft mb-3">
            <Cpu className="w-3.5 h-3.5 text-copper animate-pulse" />
            <span>AUTONOMOUS AGENTIC ENGINE</span>
          </div>
          <h2 className="font-display font-semibold text-3xl sm:text-5xl text-ink tracking-tight">
            Simulate a LangGraph <span className="grad-text">Multi-Agent Workflow</span>
          </h2>
          <p className="text-mute mt-4 text-base leading-relaxed">
            Select a query below to inspect an autonomous agent loop in action — routing intents, executing MCP retrieval tools, applying Pydantic guardrails, and calculating real-time LLM evaluation scores.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Preset Query Triggers */}
          <ScrollReveal direction="up" delay={0.1} duration={0.8} className="lg:col-span-4 space-y-3">
            <span className="chip text-mute uppercase text-xs font-mono">Select Preset Agentic Query</span>
            <div className="flex flex-col gap-3 pt-1">
              {PORTFOLIO_DATA.agenticQueries.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => runSimulation(idx)}
                  className={`text-left p-4 rounded-2xl transition-all border flex flex-col justify-between gap-2 ${
                    selectedQueryIdx === idx
                      ? 'bg-gradient-to-r from-copper/20 via-white/[0.04] to-transparent border-copper/60 shadow-[0_0_20px_rgba(217,138,74,0.25)] text-ink'
                      : 'glass hover:bg-white/[0.06] hover:border-white/20 border-white/10 text-mute hover:text-ink'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="chip text-[11px] font-mono text-copper-soft">{q.topic}</span>
                    <span className="text-xs font-mono text-mute2">Node #{idx + 1}</span>
                  </div>
                  <p className="text-sm font-medium leading-snug">{q.question}</p>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Right Column: Live Multi-Agent Execution Canvas */}
          <ScrollReveal direction="up" delay={0.2} duration={0.8} className="lg:col-span-8 space-y-6">
            <div className="glass-strong rounded-[2rem] p-6 sm:p-8 shadow-glow border border-white/12 space-y-6">
              
              {/* Terminal Window Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F57]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#FEBC2E]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#28C840]"></span>
                  </div>
                  <span className="chip font-mono text-xs text-mute2">
                    langgraph_state_machine.py — 4 Nodes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Graph Active
                  </span>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => runSimulation(selectedQueryIdx)}
                    className="p-1.5 rounded-lg glass hover:bg-white/[0.08] text-mute hover:text-ink transition-colors"
                    title="Re-run Simulation"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin text-copper' : ''}`} />
                  </button>
                </div>
              </div>

              {/* LangGraph Visual Flow Path Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentQuery.agentFlow.map((step, sIdx) => {
                  const isDone = activeStep > sIdx;
                  const isCurrent = activeStep === sIdx && isExecuting;
                  return (
                    <div
                      key={sIdx}
                      className={`p-3 rounded-xl border transition-all text-xs font-mono flex flex-col justify-between gap-1.5 ${
                        isCurrent
                          ? 'border-copper bg-copper/15 shadow-[0_0_15px_rgba(240,184,126,0.3)] text-ink scale-[1.02]'
                          : isDone
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                          : 'border-white/10 bg-white/[0.02] text-mute2 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Node {sIdx + 1}</span>
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-copper animate-ping"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-white/20"></span>
                        )}
                      </div>
                      <p className="font-semibold truncate text-[11px]">{step.node}</p>
                    </div>
                  );
                })}
              </div>

              {/* Real-time State Log Stream */}
              <div className="p-4 rounded-xl bg-obsidian/70 border border-white/10 font-mono text-xs space-y-2 max-h-36 overflow-y-auto">
                <div className="text-copper-soft flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-copper" />
                  <span>StateGraph Execution Log:</span>
                </div>
                {currentQuery.agentFlow.slice(0, Math.min(activeStep + 1, 4)).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-mute animate-fadeIn">
                    <span className="text-copper">➔</span>
                    <span>
                      <strong className="text-ink">[{step.node}]</strong> {step.action}
                    </span>
                  </div>
                ))}
              </div>

              {/* Synthesized Response Output */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="chip uppercase text-xs font-mono text-copper-soft flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-copper" />
                    <span>Ground Truth Synthesizer</span>
                  </span>
                  <span className="text-[11px] font-mono text-mute2">Schema: Pydantic Structured Output</span>
                </div>
                
                <div className="p-5 rounded-2xl glass text-ink text-sm sm:text-[15px] leading-relaxed border border-white/10 min-h-[100px] flex items-center">
                  {isExecuting ? (
                    <div className="flex items-center gap-3 text-mute font-mono text-xs">
                      <Bot className="w-4 h-4 text-copper animate-bounce" />
                      <span>Synthesizing verified multi-agent response...</span>
                    </div>
                  ) : (
                    <p className="text-slate-100 font-sans leading-relaxed">
                      {displayedResponse}
                    </p>
                  )}
                </div>
              </div>

              {/* 2026 LLM Evaluation & Observability Badges */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Faithfulness: {currentQuery.evals.faithfulness}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300">
                    <Gauge className="w-3.5 h-3.5 text-blue-400" />
                    <span>Answer Relevance: {currentQuery.evals.relevance}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg glass text-copper-soft">
                    <span>{currentQuery.evals.evalFramework}</span>
                  </div>
                </div>
                <div className="text-mute2 text-[11px]">
                  <span>Trace: {currentQuery.evals.traceId} ({currentQuery.evals.latency})</span>
                </div>
              </div>

            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}
