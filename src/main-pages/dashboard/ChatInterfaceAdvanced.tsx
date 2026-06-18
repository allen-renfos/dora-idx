import React, { useState } from 'react';
import Image from 'next/image';
import { FiPaperclip, FiSend } from 'react-icons/fi';

export const ChatInterfaceAdvanced = () => {
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
        <div className="min-h-screen bg-[#171717] flex flex-col font-[Helvetica Neue]">
            {/* Header with Profile */}
            <div className="flex items-center p-4 border-b border-[#3B3B3B] bg-[#202020]">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-400">
                        <Image
                            src="/images/my-profile-pic.png"
                            alt="George Jhon"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-white font-semibold text-xl">George Jhon</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
                {/* Chat Illustration */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-12 mb-8">
                        {/* Left person (Woman) */}
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-[#EDB75E] flex items-center justify-center mb-3 shadow-lg">
                                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 text-lg">👩</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-24 h-10 bg-[#3B3B3B] rounded-lg flex items-center justify-center shadow-md">
                                <div className="w-10 h-1.5 bg-white rounded-full"></div>
                            </div>
                        </div>

                        {/* Middle empty speech bubble */}
                        <div className="w-20 h-10 bg-[#3B3B3B] rounded-lg shadow-md"></div>

                        {/* Right person (Man) */}
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center mb-3 shadow-lg">
                                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-600 text-lg">👨</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-24 h-10 bg-[#3B3B3B] rounded-lg flex items-center justify-center shadow-md">
                                <div className="w-14 h-1.5 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-white text-3xl font-semibold mb-6 text-center">
                    Let's start Chatting
                </h1>

                {/* Description */}
                <p className="text-[#ADADAD] text-center max-w-lg leading-relaxed mb-12 text-lg">
                    Directly communicate with your agent. Ask questions, sent properties, and so much more. Send your first Message to get started!
                </p>
            </div>

            {/* Input Bar */}
            <div className="p-6 border-t border-[#3B3B3B] bg-[#202020]">
                <div className="flex items-center gap-4">
                    {/* Attachment Button */}
                    <button className="w-12 h-12 rounded-full border-2 border-[#EDB75E] flex items-center justify-center hover:bg-[#EDB75E] hover:bg-opacity-10 transition-all duration-200 group">
                        <FiPaperclip className="text-[#EDB75E] w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Message Input */}
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter message here"
                        className="flex-1 bg-[#171717] border border-[#4E4E4E] rounded-full px-6 py-4 text-white placeholder-[#ADADAD] focus:outline-none focus:border-[#EDB75E] transition-all duration-200 text-lg"
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-[#EDB75E] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#e0a94e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <FiSend className="w-5 h-5" />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterfaceAdvanced; 