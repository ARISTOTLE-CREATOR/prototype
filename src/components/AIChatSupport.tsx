/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Product, ChatMessage } from "../types";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle,
  Gem,
  Check,
  ChevronDown,
  UserCheck
} from "lucide-react";
import { mockFAQList } from "../mockData";

interface AIChatSupportProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductContext: Product | null;
}

export default function AIChatSupport({
  isOpen,
  onClose,
  selectedProductContext
}: AIChatSupportProps) {
  
  // Conversations message array state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "bot", text: "Salutations! I am your ArtisanGems Senior Concierge, sculpted to coordinate gemstone palettes or resizing options. How may I assist you today?", timestamp: "Now" }
  ]);
  const [typedMsg, setTypedMsg] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [supportMode, setSupportMode] = useState<"ai" | "human">("ai");
  const [showFaqs, setShowFaqs] = useState(false);
  const [expandedFAQIdx, setExpandedFAQIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to message bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  // Insert context prompt if a product is selected
  useEffect(() => {
    if (selectedProductContext) {
      const introText = `I see you are admiring our breathtaking "${selectedProductContext.name}". This piece is forged from ${selectedProductContext.materials.join(", ")}. Would you like me to suggest coordinating necklaces, explain ring sizes, or summon the master silversmith?`;
      setMessages(prev => [
        ...prev,
        {
          id: "ctx_" + Date.now(),
          sender: "bot",
          text: introText,
          timestamp: "Context loaded"
        }
      ]);
    }
  }, [selectedProductContext]);

  // Handle message post
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMsg.trim()) return;

    const userMessage: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: typedMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const inputForBot = typedMsg;
    setTypedMsg("");
    setIsBotTyping(true);

    if (supportMode === "ai") {
      // DYNAMIC PIPELINE ROUTING FOR REAL SERVER GEMINI RESPONSE
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            selectedProductContext: selectedProductContext ? {
              name: selectedProductContext.name,
              materials: selectedProductContext.materials,
              price: selectedProductContext.price,
              artisan: selectedProductContext.artisan.name
            } : null
          })
        });

        const data = await response.json();
        setIsBotTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: "b_" + Date.now(),
            sender: "bot",
            text: data.text || "Pardon, our concierge feed is experiencing latency. Please rest assured we are preparing your gemstone requests.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (err) {
        console.error("Gemini communication error:", err);
        setIsBotTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: "b_err_" + Date.now(),
            sender: "bot",
            text: "My apologies! Our digital concierge server is momentarily soldering. I can tell you that all our custom jewelry highlights conflicts-free emeralds, Ceylon sapphires, and solid hallmarks.",
            timestamp: "Fallback active"
          }
        ]);
      }
    } else {
      // SIMULATE HUMAN MASTER JEWELER REPLIES (WITH RETROACTIVE TIMER)
      setTimeout(() => {
        setIsBotTyping(false);
        
        let humanResponse = "Greetings! My name is Elena. I am currently soldering some custom pendants. Resizing your jewelry takes only 1 extra business day. Should we custom size this commission?";
        const lLower = inputForBot.toLowerCase();
        if (lLower.includes("ring") || lLower.includes("size")) {
          humanResponse = "Yes! I can solder this exact band in sizes 4 through 11. Custom sizing this is complimentary for your Elite Gold level!";
        } else if (lLower.includes("price") || lLower.includes("discount") || lLower.includes("cost")) {
          humanResponse = "For custom works, we provide upfront quotes before melting any alloy base. Let me know which precious metal (rose gold, yellow gold, or sterling silver) you prefer!";
        } else if (lLower.includes("turquoise") || lLower.includes("anklet")) {
          humanResponse = "Our Persian turquoise is hand-selected in Arizona. We link them using sturdy double-stranded solid sterling locks to avoid sliding.";
        }

        setMessages(prev => [
          ...prev,
          {
            id: "h_" + Date.now(),
            sender: "human_agent",
            text: `[Concierge Elena]: "${humanResponse}"`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

      }, 1800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-12 right-0 w-full sm:w-[380px] bg-white border-l border-gray-150 shadow-2xl z-50 flex flex-col justify-between luxury-glow text-luxury-charcoal" id="ai-chat-container">
      
      {/* Drawer Header */}
      <div className="bg-luxury-charcoal p-4 text-white flex justify-between items-center relative overflow-hidden">
        {/* Shimmer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-luxury-charcoal opacity-95"></div>
        
        <div className="relative z-10 flex items-center gap-2 text-left">
          <div className="p-1 px-1.5 bg-gold-500 rounded">
            <Gem className="w-5.5 h-5.5 text-luxury-charcoal" />
          </div>
          <div>
            <h3 className="font-serif text-sm tracking-wider font-semibold text-white">ArtisanGems Helper</h3>
            <p className="text-[9px] text-gray-400 font-mono tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              {supportMode === "ai" ? "Gemini Stylist Advisor Online" : " Elena (Expert Jeweler) drafting..."}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-2">
          {/* FAQ Trigger */}
          <button 
            onClick={() => setShowFaqs(!showFaqs)}
            className="p-1 text-gray-300 hover:text-gold-400"
            title="FAQs list"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          
          {/* Close */}
          <button onClick={onClose} className="p-1 text-gray-300 hover:text-red-400">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Support Mode Toggles bar */}
      <div className="bg-gray-50 border-b p-2 flex justify-between gap-2 text-[10px] font-mono">
        <button
          onClick={() => { setSupportMode("ai"); alert("Switched to high-performance server side Gemini styling mode."); }}
          className={`flex-1 py-1 rounded text-center border font-semibold flex items-center justify-center gap-1.5 transition-all ${supportMode === "ai" ? "bg-white border-gold-400 text-gold-700 shadow-xs" : "bg-transparent text-gray-600 border-transparent"}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" /> GEMINI AI CONCIERGE
        </button>
        <button
          onClick={() => { setSupportMode("human"); alert("Switched to Direct Solder Workshop Concierge pipeline [Concierge: Elena Rostova]."); }}
          className={`flex-1 py-1 rounded text-center border font-semibold flex items-center justify-center gap-1.5 transition-all ${supportMode === "human" ? "bg-white border-gold-400 text-gold-700 shadow-xs" : "bg-transparent text-gray-600 border-transparent"}`}
        >
          <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" /> HUMAN WORKSHOP
        </button>
      </div>

      {/* Accordion FAQ Drawer (if toggled) */}
      {showFaqs && (
        <div className="bg-gold-50/50 p-4 border-b text-xs border-gold-200 text-left max-h-[160px] overflow-y-auto">
          <p className="font-mono text-[9px] font-bold text-gold-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">✨ QUICK CONCIERGE ANSWER KEYS</p>
          <div className="space-y-1.5">
            {mockFAQList.map((faq, idx) => {
              const isExpanded = expandedFAQIdx === idx;
              return (
                <div key={idx} className="border-b last:border-0 pb-1">
                  <button
                    onClick={() => setExpandedFAQIdx(isExpanded ? null : idx)}
                    className="w-full py-1 text-left font-serif font-bold text-[11px] text-luxury-charcoal hover:text-gold-700 flex justify-between items-center"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <p className="font-sans text-[11.5px] text-gray-500 bg-white p-2 border rounded mt-1 leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages List Stream */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/40 space-y-3" id="chat-messages-box">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          const isHumanAgent = m.sender === "human_agent";
          
          return (
            <div 
              key={m.id} 
              className={`flex gap-2 text-xs text-left max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Profile icon bubble */}
              <div className={`p-1.5 rounded-full shrink-0 flex items-center justify-center w-7 h-7 text-white font-mono ${isUser ? 'bg-luxury-charcoal' : isHumanAgent ? 'bg-blue-600' : 'bg-gold-600'}`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </div>

              {/* Text Bubble */}
              <div className="space-y-1">
                <div className={`p-2.5 rounded shadow-xs ${isUser ? 'bg-luxury-charcoal text-white rounded-tr-none' : isHumanAgent ? 'bg-blue-50 border border-blue-200 text-blue-900 rounded-tl-none font-medium' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-xs'}`}>
                  <p className="font-sans text-[11px] leading-relaxed break-words whitespace-pre-line">{m.text}</p>
                </div>
                <p className="text-[8px] text-gray-400 font-mono tracking-wide px-1">
                  {m.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {/* Typing Loader Anim */}
        {isBotTyping && (
          <div className="flex gap-2 max-w-[80%] items-center text-left text-xs text-gray-500 font-mono italic">
            <div className="p-1 px-1.5 bg-gold-100 rounded-full">
              <Sparkles className="w-3 h-3 text-gold-500 animate-spin" />
            </div>
            <span>Concierge is soldering message response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text Message Sender Form Box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-150 flex gap-2">
        <input 
          type="text"
          value={typedMsg}
          onChange={(e) => setTypedMsg(e.target.value)}
          placeholder={supportMode === "ai" ? "Ask Gemini (e.g. Sizing or coordinate tips)..." : "Ask Elena for custom metal resizing..."}
          className="bg-gray-100 placeholder-gray-400 border-0 rounded px-3 py-2 w-full text-xs focus:ring-1 focus:ring-gold-500 focus:outline-none focus:bg-white text-luxury-charcoal"
          id="chat-input"
        />
        <button 
          type="submit" 
          className="bg-luxury-charcoal text-white hover:bg-gold-500 hover:text-luxury-charcoal p-2 rounded transition-colors"
          title="Transmit message"
          id="send-message-btn"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>

    </div>
  );
}
