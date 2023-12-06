"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { login } from '../serverActions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { authContext } from '@/utils/AuthContext';

const LoginComponent = () => {
  const router = useRouter();
  const [state, formAction] = useFormState(login, { message: '' });
  const {setAuthenticated} = useContext(authContext)
  useEffect(() => {
    if (state.message === 'success') {
      setAuthenticated(true);
      router.push('/');
    }
  }, [state.message]);
  return (
    <div className="h-[100vh] flex flex-col items-center justify-center p-4">
      <Image src="/logo.png" alt="logo" width={150} height={150} className="block mx-auto w-20 h-20" />
        <h1 className="font-bold text-2xl mb-5 text-center">Log in</h1>
      <div className="mb-5 text-center px-6">
        <p>Log in to expand your social network and communicate with colleagues.</p>
      </div>
      <form className="w-full max-w-xs" action={formAction}>
        <input
          type="text"
          placeholder="Login"
          className="input mb-5"
          name='login'
        />
        <input
          type="password"
          placeholder="Password"
          className="input mb-5"
          name='password'
        />
        <button
          type="submit"
          className="btn"
        >
          Log in
        </button>
      </form>
      <div className="mt-5">
        <p className="mt-2">
          Don’t have an account?
          {' '}
          <Link href="/signup" className="text-black font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
