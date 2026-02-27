import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import ChatMessage from "./components/ChatMessage";
import Sidebar from "./components/Sidebar";
import { Send, Menu } from "lucide-react";
import { ThemeContext } from "./context/ThemeContext";
import "./App.css";

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chatEndRef = useRef(null);

  // theme from context
  const { theme } = useContext(ThemeContext);

  // Get API URL from environment
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
    setChats(savedChats);
    if (savedChats.length > 0) {
      setActiveChatId(savedChats[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: []
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  };

  const deleteChat = (id) => {
    const updatedChats = chats.filter(chat => chat.id !== id);
    setChats(updatedChats);
    if (activeChatId === id && updatedChats.length > 0) {
      setActiveChatId(updatedChats[0].id);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;

    const userMessage = input.trim();
    const updatedChats = chats.map(chat =>
      chat.id === activeChatId
        ? {
            ...chat,
            title:
              chat.messages.length === 0
                ? userMessage.substring(0, 30)
                : chat.title,
            messages: [...chat.messages, { role: "user", content: userMessage }]
          }
        : chat
    );

    setChats(updatedChats);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/ask`, {
        question: userMessage
      });

      const finalChats = updatedChats.map(chat =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { role: "assistant", content: res.data.answer }
              ]
            }
          : chat
      );

      setChats(finalChats);
    } catch (error) {
      console.error("Error:", error);
      const errorChats = updatedChats.map(chat =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { role: "assistant", content: "❌ Error: Could not get response. Please try again." }
              ]
            }
          : chat
      );
      setChats(errorChats);
    }

    setLoading(false);
  };

  return (
    <div className={`${theme} flex h-screen overflow-hidden`}>
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setSidebarOpen(false);
        }}
        onDeleteChat={deleteChat}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] bg-clip-text text-transparent">
              VaraNex AI
            </h1>
            <p className="text-xs text-slate-400 mt-1">Powered by Groq LLaMA</p>
          </div>
        </div>

        {/* Chat Messages */}
        {activeChat ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-200 mb-2">Start a Conversation</h2>
                    <p className="text-slate-400 max-w-md">Ask me anything! I'm here to help with questions, explanations, writing, coding, and much more.</p>
                  </div>
                </div>
              ) : (
                <>
                  {activeChat.messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                  ))}
                  {loading && (
                    <div className="flex gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">AI</span>
                      </div>
                      <div className="bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef}></div>
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-700 p-4 bg-slate-800/50 backdrop-blur">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-full px-5 py-3 text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">Press Enter to send • Shift+Enter for new line</p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={createNewChat}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 group-hover:shadow-2xl transition-shadow">
                <span className="text-4xl">+</span>
              </div>
              <p className="text-lg font-semibold text-slate-200">Start Chatting</p>
              <p className="text-sm text-slate-400 mt-2">Create your first conversation</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;