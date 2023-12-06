import Image from 'next/image';
import { FiMessageCircle } from "react-icons/fi";
import Link from 'next/link';
const Header = ({authorized, avatar}:{authorized:boolean, avatar:string}) => {
    return (
        <header className='px-5 py-2 flex justify-between bg-white'>
            <Link href='/'><Image src="/logo.png" alt="Tapper Logo" width={40} height={40} ></Image></Link>
            <nav>
                <ul className='flex items-center gap-5'>
                    {authorized ?
                    <> 
                    <li><Link href='/profile'><Image src={avatar} alt='avatar' width={40} height={40}/></Link></li>
                    <li><Link href='/chats'><FiMessageCircle className='w-10 h-10'/></Link></li>
                    </>
                    :
                    <li><Link href='/login' className='btn'>Log in</Link></li>
                    }
                </ul>
            </nav>
        </header>
    )
};
export default Header;