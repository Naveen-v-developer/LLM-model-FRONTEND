import React, { useContext } from 'react';
import { Plus, Trash2, Sun, Moon, Palette } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, sidebarOpen, onClose }) {
  const { theme, setTheme, themes } = useContext(ThemeContext);

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon size={16} />;
    if (theme === 'light') return <Sun size={16} />;
    return <Palette size={16} />;
  };

  return (
    <div className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg"
      >
        ✕
      </button>

      {/* Logo/Title */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] bg-clip-text text-transparent">
          VaraNex AI
        </h1>
        <p className="text-xs text-slate-400 mt-1">Your AI Assistant</p>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="w-full mx-4 mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] hover:from-[var(--primary)] hover:to-[var(--primary-light)] rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Plus size={18} />
        New Chat
      </button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto mt-6 mx-2 space-y-2">
        {chats.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            <p>No conversations yet</p>
            <p className="text-xs mt-2">Start a new chat to begin</p>
          </div>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              className="group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-700 bg-opacity-50"
              onClick={() => onSelectChat(chat.id)}
            >
              <div
                className={`flex-1 truncate text-sm font-medium transition-colors ${
                  chat.id === activeChatId ? 'text-[var(--primary-light)]' : 'text-slate-300 group-hover:text-white'
                }`}
              >
                {chat.title}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Theme Switcher */}
      <div className="border-t border-slate-700 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider">
          {getThemeIcon()}
          <span>Theme</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                theme === t
                  ? 'bg-[var(--primary)] text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-300">Developed by</p>
        <p className="text-blue-400 mt-1">Naveen</p>
      </div>
    </div>
  );
}

export default Sidebar;