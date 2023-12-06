"use client"
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { fetchChat, sendMessage as SendToServer } from "@/app/serverActions";
import { authContext } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";

type Message = {
  fromSelf: boolean;
  text: string;
  timestamp: string;
  lastRead: boolean;
};

const MessageBubble: React.FC<Message> = ({ fromSelf, text, timestamp, lastRead }) => {
  return (
    <div className={clsx('flex', {'justify-end': fromSelf, 'justify-start': !fromSelf})}>
      <div className={clsx('max-w-xs md:max-w-md lg:max-w-lg p-2 my-1 rounded-lg', {'bg-gray-300': fromSelf, 'bg-gray-100': !fromSelf})}>
        <p className="text-sm text-gray-700">{text}</p>
        <p className={clsx('text-xs text-gray-500', { 'mb-4': fromSelf && lastRead })}>{timestamp}</p>
        {fromSelf && lastRead && <p className="text-xs text-gray-500 -mt-3 mb-1">Read</p>}
      </div>
    </div>
  );
};

const Chat = ({params}:{params:{user:string}}) => {
  const { isAuthenticated } = useContext(authContext);
  const { user } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const data = await fetchChat(0, 10,  user);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      const message = {
        toUser: user,
        text: newMessage,
        read: false,
        createdAt: new Date()
      }
      const result = await SendToServer(message);
      fetchMessages();
      setNewMessage('');
    }
  };

  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col justify-end p-4 space-y-2 bg-white h-[100vh]">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          fromSelf={message.fromSelf}
          text={message.text}
          timestamp={message.timestamp}
          lastRead={message.lastRead && index === messages.length - 1}
        />
      ))}
      <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className='border border-gray-600 rounded-lg p-2'
        />
        <button onClick={sendMessage} className='bg-[#1f1f1f] text-white text-center w-1/3 block mx-auto rounded-lg p-2'>Send</button>
    </div>
  );
};

export default Chat;
