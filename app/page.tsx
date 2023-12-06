"use client"
import { useState, useEffect, useRef } from 'react';
import { User } from '@/types/User';
import UserCard from '@/components/UserCard';
import Header from '@/components/Header';
import { IoSearch } from 'react-icons/io5';
import { fetchUser, fetchUsers, searchUsers } from './serverActions';
import { useContext } from 'react';
import { authContext } from '@/utils/AuthContext';

const MainPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [authUser, setAuthUser] = useState({} as User);
  const { isAuthenticated } = useContext(authContext);

  const fetchInitialUsers = async () => {
    const initialUsers = await fetchUsers(0, 10);
    setUsers(initialUsers);
  };

  const handleSearch = async (query: string) => {
    const searchResults = await searchUsers(query);
    setUsers(searchResults);
  };

  const debouncedSearch = (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser().then((user) => setAuthUser(user));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      fetchInitialUsers();
    }
  }, [searchTerm]);

  return (
      <div className="max-w-2xl mx-auto pb-5">
        <Header authorized={isAuthenticated} avatar={authUser.avatar as string}/>
        <div className="bg-gray-200 p-4 rounded-lg mt-4 flex gap-2">
          <IoSearch className="w-6 h-6 self-center" />
          <input
            className="border border-gray-400 bg-white p-2 rounded-lg w-full"
            placeholder="Search by name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 space-y-4">
          {users.map((user, index) => (
            <UserCard {...user} key={index} />
          ))}
        </div>
      </div>
  );
};

export default MainPage;