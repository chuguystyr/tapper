import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSkype,
  FaTwitter,
} from "react-icons/fa";
import { SiGooglemessages } from "react-icons/si";
type UserCardProps = {
    login: string;
    avatar?: string | null | File;
    firstName: string;
    lastName: string;
    age?: number;
    location?: string;
    linkedIn?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    skype?: string;
  };
const UserCard: React.FC<UserCardProps> = ({
    login,
    avatar,
    firstName,
    lastName,
    age,
    location,
    linkedIn,
    twitter,
    instagram,
    facebook,
    skype,
  }) => {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          {avatar ? (
            <Image
              src={avatar as string}
              alt="avatar"
              width={80}
              height={80}
              className="rounded-full w-14 h-14"
            />
          ) : (
            <div className="rounded-full bg-gray-300 w-14 h-14"></div>
          )}
          <div>
            <div className="text-black font-semibold">
              {firstName} {lastName} {age}
            </div>
            <div className="text-gray-600">{location}</div>
            <div className="flex space-x-2 mt-2">
              {linkedIn && (
                <Link href={linkedIn}>
                  <FaLinkedin className="w-6 h-6 text-blue-500" />
                </Link>
              )}
              {twitter && (
                <Link href={twitter}>
                  <FaTwitter className="w-6 h-6 text-blue-500" />
                </Link>
              )}
              {instagram && (
                <Link href={instagram}>
                  <FaInstagram className="w-6 h-6 text-pink-500" />
                </Link>
              )}
              {facebook && (
                <Link href={facebook}>
                  <FaFacebook className="w-6 h-6 text-blue-500" />
                </Link>
              )}
              {skype && (
                <Link href={skype}>
                  <FaSkype className="w-6 h-6 text-blue-500" />
                </Link>
              )}
            </div>
          </div>
          <Link href={`/chat/${login}`} className="self-center absolute left-[310px]"><SiGooglemessages className="w-10 h-10 text-blue-500" /></Link>
        </div>
      </div>
    );
  };
  export default UserCard;