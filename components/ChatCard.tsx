"use client"
import { useRouter } from "next/navigation";
import Image from "next/image";
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

const ChatCard: React.FC<MessageProps> = ({
  fromUser,
  text,
  otherUserAvatar,
  otherUserLogin,
  otherUserName
}) => {
  const router = useRouter();
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md" onClick={() => router.push(`/chat/${otherUserLogin}`)}>
      <div className="flex items-center space-x-4">
        {otherUserAvatar ? (
          <Image
            src={otherUserAvatar as string}
            alt="avatar"
            width={80}
            height={80}
            className="rounded-full w-14 h-14"
          />
        ) : (
          <div className="rounded-full bg-gray-300 w-14 h-14"></div>
        )}
        <div>
          <div className="text-black font-semibold">{otherUserName}</div>
          <div className="text-gray-600">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
