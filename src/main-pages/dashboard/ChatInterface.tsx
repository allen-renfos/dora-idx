import React, { useState } from 'react';
import Image from 'next/image';
import { FiPaperclip, FiSend } from 'react-icons/fi';

export const ChatInterface = () => {
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
        <div className="min-h-screen bg-[var(--canvas)] flex flex-col">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-[var(--line)] bg-[var(--cream)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--line)]">
                        <Image
                            src="/images/my-profile-pic.png"
                            alt="George Jhon"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-[var(--ink)] font-serif text-lg">George Jhon</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
                {/* Chat Illustration */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-8 mb-6">
                        {/* Left person */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--sage)] flex items-center justify-center mb-2">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-600 text-xs">👩</span>
                                </div>
                            </div>
                            <div className="w-20 h-8 bg-[var(--canvas-2)] rounded-lg flex items-center justify-center">
                                <div className="w-8 h-1 bg-[var(--ink-faint)] rounded"></div>
                            </div>
                        </div>

                        {/* Middle speech bubble */}
                        <div className="w-16 h-8 bg-[var(--canvas-2)] rounded-lg"></div>

                        {/* Right person */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center mb-2">
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-600 text-xs">👨</span>
                                </div>
                            </div>
                            <div className="w-20 h-8 bg-[var(--canvas-2)] rounded-lg flex items-center justify-center">
                                <div className="w-12 h-1 bg-[var(--ink-faint)] rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-[var(--ink)] font-serif text-2xl md:text-3xl mb-4 text-center">
                    Start the conversation
                </h1>

                {/* Description */}
                <p className="text-[var(--ink-soft)] text-center max-w-md leading-relaxed mb-8">
                    Speak directly with your advisor — ask questions, share homes you love, and so much more. Send your first message to begin.
                </p>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-[var(--line)] bg-[var(--cream)]">
                <div className="flex items-center gap-3">
                    {/* Attachment Button */}
                    <button className="w-10 h-10 rounded-full border border-[var(--line-medium)] flex items-center justify-center text-[var(--sage-deep)] hover:border-[var(--sage-deep)] hover:bg-[var(--canvas)] transition-colors">
                        <FiPaperclip className="w-4 h-4" />
                    </button>

                    {/* Message Input */}
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter message here"
                        className="flex-1 bg-[var(--canvas)] border border-[var(--line)] rounded-full px-4 py-3 text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:border-[var(--sage-deep)] transition-colors"
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-[var(--pine)] text-[var(--on-pine)] px-6 py-3 rounded-full font-[family-name:var(--font-accent)] text-[13px] uppercase tracking-[0.16em] hover:bg-[var(--pine-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <FiSend className="w-4 h-4" />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface; 