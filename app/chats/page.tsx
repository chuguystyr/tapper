"use client"
import Header from "@/components/Header";
import ChatCard from "@/components/ChatCard";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { authContext } from "@/utils/AuthContext";
import { fetchChatsList, fetchUser } from "../serverActions";
import { User } from "@/types/User";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
type MessageProps = {
  fromUser: string;
  toUser: string;
  text: string;
  read: boolean;
  createdAt: Date;
  otherUserAvatar?: string;
  otherUserLogin: string;
  otherUserName: string;
};


const ChatsPage: React.FC = () => {
  const { isAuthenticated } = useContext(authContext);
  const [user, setUser] = useState({} as User);
  const [chats, setChats] = useState<MessageProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const filteredChats = chats.filter(chat =>
    chat.toUser.toLowerCase().includes(searchTerm.toLowerCase()) || chat.fromUser.toLowerCase().includes(searchTerm.toLowerCase())
  );
    const router = useRouter();
    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
      fetchUser().then((user) => setUser(user));
    }, [isAuthenticated]);
    useEffect(() => {
      fetchChatsList().then((chats) => setChats(chats as MessageProps[]));
    }, [])
    return (
      <div className="max-w-2xl pb-5">
        <Header authorized={isAuthenticated} avatar={user.avatar as string} />
        <div className="bg-gray-200 p-4 rounded-lg mt-4 flex gap-2">
          <IoSearch className="w-6 h-6 self-center" />
          <input
            className="border border-gray-400 bg-white p-2 rounded-lg w-full"
            placeholder="Search by name"
            onChange={handleSearchChange}
          />
        </div>
        <div className="mt-4 space-y-4 bg-white rounded-md">
          {filteredChats.length === 0 && searchTerm.length > 0 && <p className='text-center font-semibold'>No chats found</p>}
          {filteredChats.length > 0 && searchTerm.length > 0 && filteredChats.map((chat) => {
            return (
              <ChatCard
                fromUser={chat.fromUser}
                toUser={chat.toUser}
                text={chat.text}
                read={chat.read}
                createdAt={chat.createdAt}
                otherUserAvatar={chat.otherUserAvatar}
                otherUserLogin={chat.otherUserLogin}
                otherUserName={chat.otherUserName}
              />
            );
          
          })}
          {searchTerm.length === 0 && chats.map((chat) => {
            return (
              <ChatCard
                fromUser={chat.fromUser}
                toUser={chat.toUser}
                text={chat.text}
                read={chat.read}
                createdAt={chat.createdAt}
                otherUserAvatar={chat.otherUserAvatar}
                otherUserLogin={chat.otherUserLogin}
                otherUserName={chat.otherUserName}
              />
            );
          })}
        </div>
      </div>
    )
};

export default ChatsPage;