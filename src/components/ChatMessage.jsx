import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot } from 'lucide-react';

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 mb-4 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl px-4 py-3 shadow-md transition-all duration-200 ${
          isUser
            ? 'bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] text-white rounded-br-none'
            : 'bg-slate-700 dark:bg-slate-800 text-slate-100 rounded-bl-none border border-slate-600'
        }`}
      >
        {isUser ? (
          <p className="text-base leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none text-sm leading-relaxed prose-headings:text-lg prose-headings:font-semibold prose-p:mb-2 prose-ul:my-2 prose-li:my-1 prose-code:text-sm prose-code:bg-slate-900 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:p-3 prose-pre:rounded-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;