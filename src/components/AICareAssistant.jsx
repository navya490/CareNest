import React, { useState, useRef, useEffect } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldAlert,
  User,
  RotateCcw,
  Clock,
  Heart,
  Pill,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { generateNestBotResponse, SUGGESTED_QUESTIONS } from '../data/aiKnowledgeBase';

export default function AICareAssistant() {
  const {
    patient,
    medications,
    todayDoses,
    appointments,
    speakText,
    stopSpeech,
    soundEnabled
  } = useCareNest();

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello ${patient.preferredName || patient.name}! 🌸 I am **NestBot**, your CareNest daily health companion.\n\nI can help you review today's medication schedule, check upcoming doctor visits, or answer questions about navigating your care dashboard. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEmergency: false
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thoughtful response with instant contextual awareness
    setTimeout(() => {
      const contextData = {
        patient,
        medications,
        todayDoses,
        appointments
      };

      const aiResult = generateNestBotResponse(query, contextData);

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: aiResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: aiResult.isEmergency
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Auto speak if audio enabled
      if (soundEnabled && aiResult.audioMessage) {
        speakText(aiResult.audioMessage);
      }
    }, 600);
  };

  const handleQuestionChipClick = (q) => {
    handleSendMessage(q);
  };

  const handleClearChat = () => {
    stopSpeech();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `Chat restarted. How can I assist you with your schedule, ${patient.preferredName || patient.name}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: false
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sage-600 to-sage-500 text-white flex items-center justify-center shadow-md shadow-sage-600/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                NestBot AI Care Assistant
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                AI Companion
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Context-aware guidance on medication timings, doctor visits, and daily wellness.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold shadow-soft-sm transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Safety Policy Disclaimer Card */}
      <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs text-sage-900 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-sage-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-extrabold">Safety & Medical Guardrail Notice</p>
          <p className="text-sage-800 font-medium leading-relaxed">
            NestBot helps explain your schedule, instructions, and appointments. It does <strong>not</strong> diagnose medical conditions, prescribe medication, or advise changing doctor-ordered dosages. For emergency symptoms, dial <strong>911</strong> immediately.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-soft-lg flex flex-col h-[580px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-sage-700" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 ${
                    isBot
                      ? msg.isEmergency
                        ? 'bg-coral-50 border-2 border-coral-400 text-coral-950'
                        : 'bg-ivory-50 border border-ivory-300/80 text-stone-800'
                      : 'bg-sage-600 text-white font-medium'
                  }`}
                >
                  {/* Message content */}
                  <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
                    {msg.text}
                  </div>

                  {/* Message footer */}
                  <div
                    className={`flex items-center justify-between gap-4 pt-1 text-[11px] font-semibold ${
                      isBot ? 'text-stone-400' : 'text-sage-200'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {isBot && (
                      <button
                        onClick={() => speakText(msg.text.replace(/[*#]/g, ''))}
                        className="flex items-center gap-1 text-sage-700 hover:text-sage-900 transition-colors"
                        title="Read message aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Read aloud</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-stone-200 text-stone-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-9 h-9 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-ivory-50 border border-ivory-300 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sage-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-sage-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-sage-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick questions:
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuestionChipClick(q)}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-sage-50 hover:border-sage-300 hover:text-sage-800 transition-all whitespace-nowrap shadow-soft-sm flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask NestBot about today's schedule, doctor visits, or instructions...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-5 py-3 rounded-2xl bg-sage-600 hover:bg-sage-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-sage-600/20 flex items-center gap-2 transition-all active:scale-95 flex-shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
