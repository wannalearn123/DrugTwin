import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Clock, Check, CheckCheck } from 'lucide-react';

const MessageModal = ({ isOpen, onClose, patient }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample messages untuk demo
  const initialMessages = [
    {
      id: 1,
      sender: 'doctor',
      text: 'Halo, bagaimana kabar Anda hari ini?',
      timestamp: '09:00',
      status: 'read'
    },
    {
      id: 2,
      sender: 'patient',
      text: 'Baik dokter, terima kasih. Saya sudah minum obat sesuai jadwal.',
      timestamp: '09:15',
      status: 'read'
    },
    {
      id: 3,
      sender: 'doctor',
      text: 'Bagus! Apakah ada keluhan atau efek samping yang dirasakan?',
      timestamp: '09:16',
      status: 'read'
    },
    {
      id: 4,
      sender: 'patient',
      text: 'Tidak ada dokter, tapi saya masih merasa sedikit pusing di pagi hari.',
      timestamp: '09:20',
      status: 'delivered'
    }
  ];

  useEffect(() => {
    if (isOpen && patient) {
      setMessages(initialMessages);
    }
  }, [isOpen, patient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      id: messages.length + 1,
      sender: 'doctor',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulasi typing indicator
    setIsTyping(true);
    
    // Simulasi auto-reply dari pasien
    setTimeout(() => {
      setIsTyping(false);
      const autoReply = {
        id: messages.length + 2,
        sender: 'patient',
        text: getAutoReply(newMessage),
        timestamp: new Date().toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: 'delivered'
      };
      setMessages(prev => [...prev, autoReply]);
    }, 2000);
  };

  const getAutoReply = (doctorMessage) => {
    const lowerMsg = doctorMessage.toLowerCase();
    if (lowerMsg.includes('obat') || lowerMsg.includes('minum')) {
      return 'Baik dokter, saya akan rutin minum obat sesuai jadwal yang diberikan.';
    } else if (lowerMsg.includes('kontrol') || lowerMsg.includes('kunjungan')) {
      return 'Siap dokter, kapan jadwal kontrol berikutnya?';
    } else if (lowerMsg.includes('keluhan') || lowerMsg.includes('sakit')) {
      return 'Alhamdulillah kondisi saya sudah membaik dokter.';
    } else {
      return 'Terima kasih dokter atas perhatiannya.';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {patient ? patient.name : 'Pasien'}
              </h3>
              <p className="text-sm text-emerald-600">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'doctor'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div
                  className={`flex items-center justify-end space-x-1 mt-1 ${
                    message.sender === 'doctor' ? 'text-emerald-100' : 'text-gray-500'
                  }`}
                >
                  <span className="text-xs">{message.timestamp}</span>
                  {message.sender === 'doctor' && (
                    <div className="text-xs">
                      {message.status === 'sent' && <Check size={12} />}
                      {message.status === 'delivered' && <CheckCheck size={12} />}
                      {message.status === 'read' && <CheckCheck size={12} className="text-emerald-200" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {['Bagaimana kondisinya?', 'Sudah minum obat?', 'Ada keluhan?'].map((reply, index) => (
              <button
                key={index}
                onClick={() => setNewMessage(reply)}
                className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs hover:bg-emerald-100 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={1}
                style={{ maxHeight: '80px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={newMessage.trim() === ''}
              className={`p-2 rounded-lg transition-colors ${
                newMessage.trim() === ''
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;