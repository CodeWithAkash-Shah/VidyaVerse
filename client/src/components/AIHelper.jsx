import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot } from 'lucide-react';
import TypingText from '@/lib/Typingtext';
import apiService from '@/services/api';
import { useSelector } from 'react-redux';

// Student questions
const studentQuestions = [
  'What is VidyaVerse and how can it help me with my studies?',
  'How does peer doubt-solving work on the platform?',
  'Can I upload my class notes and get AI insights?',
  'How do I provide feedback on my classes?',
  'What kind of events can I expect on VidyaVerse?',
  'How does the AI tailor answers to my weak subjects?',
  'What insights do teachers get from student feedback?',
  'How can I stay updated on exams and competitions?',
];

// Teacher questions
const teacherQuestions = [
  'How can I improve student engagement in my classes?',
  'What are effective strategies for teaching difficult topics?',
  'How can I use student feedback to enhance my teaching?',
  'What are some classroom management techniques?',
  'How can I incorporate technology in my lessons?',
  'What are the latest trends in pedagogy for my subject?',
];

const AIHelper = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your AI assistant for VidyaVerse. Click a suggested question or type your own (teachers only) to get started!",
      isUser: false,
    },
  ]);
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);
  const [inputText, setInputText] = useState(''); // For teacher input
  const messagesEndRef = useRef(null);

  // Get user role and ID from Redux store
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher';
  const userId = user?.id;

  // Load messages from localStorage on mount, reset on reload
  useEffect(() => {
    if (userId) {
      const storedMessages = localStorage.getItem(`chat_${userId}_${user?.role}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }
    // Reset on reload by not persisting initial state
  }, [userId, user?.role]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`chat_${userId}_${user?.role}`, JSON.stringify(messages));
    }
  }, [messages, userId, user?.role]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (question) => {
    if (!question.trim()) return; // Prevent empty submissions

    const newId = messages.length + 1;
    const userMessage = { id: newId, text: question, isUser: true };
    const thinkingMessage = { id: newId + 1, text: '🤖 Thinking...', isUser: false };

    setMessages([...messages, userMessage, thinkingMessage]);

    try {
      let data;
      if (isTeacher) {
        data = await apiService.gemini.askTeacher({
          prompt: question,
          topic: 'Teaching',
          question,
        });
      } else {
        data = await apiService.gemini.askBasic({ message: question });
      }

      const aiMessage = {
        id: newId + 2,
        text: data.response || '⚠️ Sorry, I couldn’t understand that.',
        isUser: false,
        isTyping: true,
      };

      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = {
        id: newId + 2,
        text: '❌ Failed to connect to AI. Try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMsg]);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && isTeacher) {
      handleSendMessage(inputText);
      setInputText(''); // Clear input after submission
    }
  };

  return (
    <div>
      <div
        className={`fixed bottom-20 md:bottom-4 right-4 z-40 transition-all duration-300 ${isExpanded
            ? isFullyExpanded
              ? 'w-[60vw] h-[80vh]'
              : 'w-[90vw] md:w-[650px] h-[700px]'
            : 'w-12 h-12 overflow-hidden rounded-full'
          }`}
      >
        {!isExpanded ? (
          <Button
            onClick={() => setIsExpanded(true)}
            className="w-12 h-12 rounded-full bg-gray-800 p-0 shadow-xl hover:bg-gray-700"
          >
            <Bot className="text-white w-6 h-6" />
          </Button>
        ) : (
          <div className="flex flex-col h-full rounded-lg shadow-xl bg-white border border-gray-300 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <span className="font-semibold">
                  {isTeacher ? 'Teacher AI Assistant' : 'VidyaVerse AI Helper'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="hover:bg-gray-700 h-6 w-6 p-0 text-white"
              >
                ×
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[75%] text-sm ${message.isUser ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-800'
                      }`}
                  >
                    {message.isTyping ? (
                      <TypingText
                        text={message.text}
                        speed={5}
                        onDone={() => {
                          setMessages((prev) =>
                            prev.map((msg) =>
                              msg.id === message.id ? { ...msg, isTyping: false } : msg
                            )
                          );
                        }}
                      />
                    ) : (
                      <div
                        className="ai-message"
                        dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '') }}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box for Teachers */}
            {isTeacher && (
              <form onSubmit={handleInputSubmit} className="p-3 border-t border-gray-300 bg-white">
                <Input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a teaching-related question..."
                  className="w-full text-sm"
                />
                <Button type="submit" size="sm" className="mt-2 w-full">
                  Send
                </Button>
              </form>
            )}

            {/* Suggested Questions */}
            <div className="p-3 border-t border-gray-300 bg-white">
              <div className="text-sm font-medium text-gray-800 mb-2">
                Suggested Questions
              </div>
              <div className="flex flex-wrap gap-2">
                {(isTeacher ? teacherQuestions : studentQuestions).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(question)}
                    className="text-xs text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Expand/Shrink Button */}
            <div className="p-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullyExpanded((prev) => !prev)}
                className="text-xs"
              >
                {isFullyExpanded ? 'Shrink' : 'Expand More'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHelper;