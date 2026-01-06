import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaComments } from "react-icons/fa";
import { useSelector } from "react-redux";

const Chatbot = () => {
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I am your AgriConnect Assistant. How can I help you today? You can ask about crop prices or market trends.",
            sender: "bot",
        },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Use a ref to keep track of the latest messages state for the timeout callback
    const messagesRef = useRef(messages);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);


    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: input,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Simulate AI Response
        setTimeout(() => {
            const lowerInput = userMessage.text.toLowerCase();
            let botResponse = "I'm not sure about that. Try asking about 'price', 'tomato', 'potato', or 'weather'.";

            if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                botResponse = "Hello! tailored for farmers and buyers. How can I assist you?";
            } else if (lowerInput.includes("price")) {
                botResponse = "Market prices update daily. Potatoes are currently ₹20/kg and Tomatoes are ₹35/kg in the central market.";
            } else if (lowerInput.includes("tomato")) {
                botResponse = "Tomatoes are currently trending at ₹35/kg. The demand is high this week!";
            } else if (lowerInput.includes("potato")) {
                botResponse = "Potatoes are stable at ₹20/kg. Good supply available.";
            } else if (lowerInput.includes("weather")) {
                botResponse = "It looks sunny today! Perfect for harvesting.";
            } else if (lowerInput.includes("help")) {
                botResponse = "You can navigate to the Dashboard to list crops, or browse the marketplace to buy produce.";
            }

            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: botResponse, sender: "bot" },
            ]);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    if (!user) return null; // Only show for logged in users

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-lg shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-green-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <FaRobot className="text-xl" />
                            <h3 className="font-semibold">AgriConnect AI</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 transition"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === "user"
                                        ? "bg-green-600 text-white self-end rounded-br-none"
                                        : "bg-white border border-gray-200 text-gray-800 self-start rounded-bl-none shadow-sm"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about prices..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition shadow-md flex items-center justify-center w-10 h-10"
                        >
                            <FaPaperPlane className="text-sm" />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
            >
                {isOpen ? <FaTimes className="text-2xl" /> : <FaComments className="text-2xl" />}
            </button>
        </div>
    );
};

export default Chatbot;
