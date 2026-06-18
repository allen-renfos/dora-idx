import React, { useState } from 'react';
import Image from 'next/image';
import { FiPaperclip, FiSend } from 'react-icons/fi';

export const ChatInterfaceMobile = () => {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            // Handle sending message logic here
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="h-screen bg-[#171717] flex flex-col font-[Helvetica Neue] overflow-hidden">
            {/* Header with Profile */}
            <div className="flex items-center p-4 border-b border-[#3B3B3B] bg-[#202020] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-400">
                        <Image
                            src="/images/my-profile-pic.png"
                            alt="George Jhon"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-white font-semibold text-lg">George Jhon</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 overflow-y-auto">
                {/* Chat Illustration */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-6 mb-6">
                        {/* Left person (Woman) */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[#EDB75E] flex items-center justify-center mb-2 shadow-lg">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 text-sm">👩</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-20 h-8 bg-[#3B3B3B] rounded-lg flex items-center justify-center shadow-md">
                                <div className="w-8 h-1 bg-white rounded-full"></div>
                            </div>
                        </div>

                        {/* Middle empty speech bubble */}
                        <div className="w-16 h-8 bg-[#3B3B3B] rounded-lg shadow-md"></div>

                        {/* Right person (Man) */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center mb-2 shadow-lg">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 text-sm">👨</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-20 h-8 bg-[#3B3B3B] rounded-lg flex items-center justify-center shadow-md">
                                <div className="w-12 h-1 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-white text-2xl font-semibold mb-4 text-center px-4">
                    Let's start Chatting
                </h1>

                {/* Description */}
                <p className="text-[#ADADAD] text-center max-w-sm leading-relaxed mb-8 text-base px-4">
                    Directly communicate with your agent. Ask questions, sent properties, and so much more. Send your first Message to get started!
                </p>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-[#3B3B3B] bg-[#202020] flex-shrink-0">
                <div className="flex items-center gap-3">
                    {/* Attachment Button */}
                    <button className="w-10 h-10 rounded-full border-2 border-[#EDB75E] flex items-center justify-center hover:bg-[#EDB75E] hover:bg-opacity-10 transition-all duration-200 group flex-shrink-0">
                        <FiPaperclip className="text-[#EDB75E] w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Message Input */}
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter message here"
                        className="flex-1 bg-[#171717] border border-[#4E4E4E] rounded-full px-4 py-3 text-white placeholder-[#ADADAD] focus:outline-none focus:border-[#EDB75E] transition-all duration-200 text-base min-w-0"
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-[#EDB75E] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#e0a94e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0"
                    >
                        <FiSend className="w-4 h-4" />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterfaceMobile; 