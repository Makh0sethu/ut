import React, { useState } from 'react';
import { KpiMetric } from '../types';
import { MessageSquare, Send, Bot, X, Sparkles, ChevronRight } from 'lucide-react';

interface ExecutiveChatProps {
  kpis: KpiMetric[];
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const ExecutiveChat: React.FC<ExecutiveChatProps> = ({ kpis, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Good day Executive Director. I am your ZETDC Performance Cockpit Assistant. All 9 operational instruments are currently streaming telemetry. How can I analyze the distribution performance for you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const prompt = input;
    setInput('');

    // Generate intelligent AI Response based on current metrics
    setTimeout(() => {
      let replyText = '';
      const promptLower = prompt.toLowerCase();

      if (promptLower.includes('saidi') || promptLower.includes('interruption') || promptLower.includes('duration')) {
        const saidi = kpis.find((k) => k.id === 'saidi');
        replyText = `SAIDI is currently at ${saidi?.value} ${saidi?.unit} against a target of ${saidi?.target}. Primary contributors to interruption duration include network feeder trips in the Northern Region.`;
      } else if (promptLower.includes('loss') || promptLower.includes('system losses')) {
        const losses = kpis.find((k) => k.id === 'system_losses');
        replyText = `System Losses are measured at ${losses?.value}%. Non-technical losses account for ~11.2% while technical transmission line dissipation accounts for the remaining 5.1%. Substation metering upgrades are currently underway.`;
      } else if (promptLower.includes('collection') || promptLower.includes('revenue')) {
        const coll = kpis.find((k) => k.id === 'collection_index');
        replyText = `Collection Index stands at ${coll?.value}%, outperforming the target threshold of ${coll?.target}%. Prepaid smart meter migrations in urban zones have boosted cash realisation.`;
      } else if (promptLower.includes('alert') || promptLower.includes('summary') || promptLower.includes('status')) {
        replyText = `Executive Summary: Collection Index and Energy Sales show optimal growth. However, SAIFI (interruption frequency) and Connection Waiting Periods require management intervention in the Eastern and Southern districts.`;
      } else {
        replyText = `Telemetry analysis complete across all 9 KPIs. Overall ZETDC System Health Index is running at ${Math.round(
          (kpis.filter((k) => k.value <= k.target).length / kpis.length) * 100
        )}% optimal efficiency across 5 distribution regions.`;
      }

      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 lg:right-[15rem] xl:right-[17rem] z-50 w-full max-w-md bg-panel border border-line rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] text-slate-100 animate-in slide-in-from-bottom-5 duration-200">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-panel border-b border-line">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-accent/15 border border-accent/40 text-accent">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white font-sans">ZETDC COCKPIT COPILOT</h3>
            <p className="text-[10px] font-mono text-accent uppercase tracking-wider">
              REAL-TIME TELEMETRY ANALYTICS
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-panel-raised text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-canvas/80">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-accent text-white rounded-br-none shadow-md font-sans'
                  : 'bg-panel-alt border border-line text-slate-200 rounded-bl-none shadow-md font-sans'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
              {m.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-3 py-2 bg-panel border-t border-line flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono text-slate-400">
        <button
          onClick={() => setInput('Analyze SAIDI & SAIFI outages')}
          className="px-2 py-1 rounded-full bg-panel-alt hover:bg-panel-raised hover:text-accent border border-line whitespace-nowrap"
        >
          Outages
        </button>
        <button
          onClick={() => setInput('What is the System Losses breakdown?')}
          className="px-2 py-1 rounded-full bg-panel-alt hover:bg-panel-raised hover:text-accent border border-line whitespace-nowrap"
        >
          Losses
        </button>
        <button
          onClick={() => setInput('Give me an executive summary')}
          className="px-2 py-1 rounded-full bg-panel-alt hover:bg-panel-raised hover:text-accent border border-line whitespace-nowrap"
        >
          Summary
        </button>
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-panel border-t border-line flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot about cockpit metrics..."
          className="flex-1 bg-panel-alt border border-line rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-accent hover:bg-accent-hover text-white transition-colors shadow-md"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
