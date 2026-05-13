"use client";
import { useState, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";

export default function ChatBot({ currentPlan, setUpdatedPlan, modalOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (modalOpen) setIsOpen(true);
  }, [modalOpen]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm TripGenie 🤖. How would you like to modify your trip?" },
  ]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: prompt,
          currentPlan,
        }),
      });

      const data = await res.json();
      if (data.plan) {
        setUpdatedPlan(data.plan);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "✅ Your itinerary has been updated!" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, I couldn’t modify the plan." },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error contacting AI. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all z-50"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
            TripGenie Chat
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  m.sender === "user"
                    ? "bg-blue-100 text-blue-900 self-end ml-auto"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <p className="text-gray-500 text-center">Thinking...</p>}
          </div>

          <div className="flex border-t border-gray-200">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Modify my Day 2 plan..."
              className="flex-1 px-3 py-2 outline-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-3 text-blue-600 hover:text-blue-800"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
