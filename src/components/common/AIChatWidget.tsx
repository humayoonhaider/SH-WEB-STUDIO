import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { api } from '../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'intro-1',
    role: 'assistant',
    content: `Hello! 👋 Welcome to **SH Web Studio**.

I am your dedicated AI Assistant. I can help you with:
- 🛠️ **Our Services** (React, MERN Stack, Custom Business Web Apps, MIS)
- 💰 **Affordable Pricing** ($99 Starter, $199 Standard with 50% OFF, $399 Enterprise)
- 🚀 **Live Case Studies** (School MIS, E-Commerce Shop, Intelligence Hub)
- 🤝 **10% Client Referral Program** (Earn payouts by referring projects)
- 👥 **Our Founders** (Humayoon, Shariq, Shujaulmulk)

What would you like to explore? Aap Roman Urdu ya English mein pooch sakte hain!`,
    timestamp: new Date(),
  },
];

const QUICK_PROMPTS = [
  { label: '💰 Pricing Plans ($99+)', prompt: 'What are your pricing plans and packages?' },
  { label: '🚀 Live Projects & Demos', prompt: 'Tell me about your live projects and case studies like School MIS.' },
  { label: '🛠️ Our Services', prompt: 'What services does SH Web Studio provide?' },
  { label: '🤝 10% Referral Program', prompt: 'How does the 10% referral program work?' },
  { label: '👥 Founders & Team', prompt: 'Who are the founders of SH Web Studio?' },
  { label: '📬 Start a Project', prompt: 'How can I hire SH Web Studio or get a quote?' },
];

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.chat.sendMessage(historyPayload, text);
      const replyText = res?.data?.reply || (res as any)?.reply;

      if (replyText) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: replyText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('No reply received');
      }
    } catch (err) {
      console.warn('Chat request failed, using intelligent assistant fallback');
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `I'm happy to help you with **SH Web Studio**! We specialize in custom web apps, modern React development, and business management systems (MIS).

You can check out:
- 💰 [Our Affordable Pricing Packages](/pricing) (starting at $99)
- 🚀 [Our Live Portfolio & Case Studies](/work)
- 📬 [Get a Quick Quote or Free Consultation](/contact)

Feel free to ask any specific question!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Helper to format text with bold, bullet points and markdown links
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, lineIdx) => {
      // Markdown link regex: [text](url)
      const parts = [];
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        const linkText = match[1];
        const linkUrl = match[2];
        const isExternal = linkUrl.startsWith('http');

        if (isExternal) {
          parts.push(
            <a
              key={`${lineIdx}-${match.index}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-blue-400 underline hover:text-blue-300 font-medium"
            >
              {linkText}
              <ExternalLink className="w-3 h-3 inline" />
            </a>
          );
        } else {
          parts.push(
            <Link
              key={`${lineIdx}-${match.index}`}
              to={linkUrl}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-0.5 text-blue-400 underline hover:text-blue-300 font-semibold"
            >
              {linkText}
              <ArrowRight className="w-3 h-3 inline" />
            </Link>
          );
        }
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Process bold formatting (**bold**) in text parts
      const processedElements = parts.map((part, pIdx) => {
        if (typeof part !== 'string') return part;

        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={`p-${pIdx}`}>
            {boldParts.map((bPart, bIdx) => {
              if (bPart.startsWith('**') && bPart.endsWith('**')) {
                return (
                  <strong key={bIdx} className="font-bold text-white">
                    {bPart.slice(2, -2)}
                  </strong>
                );
              }
              return bPart;
            })}
          </span>
        );
      });

      // Handle headers and bullet points
      if (line.startsWith('### ')) {
        return (
          <div key={lineIdx} className="text-sm font-bold text-blue-400 mt-2 mb-1">
            {processedElements}
          </div>
        );
      }

      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 ml-2 my-0.5">
            <span className="text-blue-400 text-xs mt-1">•</span>
            <span className="flex-1">{processedElements}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 ml-1 my-0.5">
            <span className="flex-1">{processedElements}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className="min-h-[1.2rem] my-0.5 leading-relaxed">
          {processedElements}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end print:hidden">
      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] max-w-[420px] h-[580px] max-h-[85vh] bg-[#0E0F16] border border-[#232638] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#141622] border-b border-[#232638] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#141622] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">SH Studio AI</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                    v3.8
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <span>Web Studio Consultant</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm bg-gradient-to-b from-[#0E0F16] via-[#0B0C12] to-[#0E0F16]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-neutral-200 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-[#161824] border border-[#26293C] rounded-bl-none'
                  }`}
                >
                  <div className="text-xs sm:text-[13px]">
                    {renderFormattedContent(msg.content)}
                  </div>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-neutral-500'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start animate-in fade-in duration-150">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#161824] border border-[#26293C] rounded-2xl rounded-bl-none px-4 py-3 text-neutral-400 flex items-center gap-1.5">
                  <span className="text-xs text-neutral-400">SH AI is thinking</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-[#12131F] border-t border-[#232638] flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#1A1C2C] hover:bg-blue-600/20 text-neutral-300 hover:text-blue-300 border border-[#2C3048] hover:border-blue-500/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#141622] border-t border-[#232638] shrink-0">
            <div className="flex items-center gap-2 bg-[#0B0C12] border border-[#26283A] focus-within:border-blue-500 rounded-xl px-3 py-1.5 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about projects, pricing, services..."
                className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none py-1"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-all cursor-pointer shadow-md shadow-blue-600/20 shrink-0"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1.5 px-1 font-mono">
              <span>Press Enter to send</span>
              <span>SH Web Studio Assistant</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-blue-400/30"
        aria-label="Toggle AI Studio Chatbot"
      >
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <>
              <Bot className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-blue-600" />
            </>
          )}
        </span>

        {!isOpen && (
          <span className="text-xs sm:text-sm font-bold tracking-wide flex items-center gap-1.5">
            <span>Chat with AI</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </span>
        )}
      </button>
    </div>
  );
};
