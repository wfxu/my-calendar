'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkLoginStatus } from '@/lib/auth'; // 假设你有一个检查登录状态的函数

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyLogin = async () => {
      const loggedIn = await checkLoginStatus();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        setSuccess('You are already logged in.');
      }
    };
    verifyLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    if (res.ok) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      const { error } = await res.json();
      setError(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {isLoggedIn ? (
          <p className="text-green-500">{success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Login
            </button>
          </form>
        )}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {success && !isLoggedIn && <p className="mt-4 text-sm text-green-500">{success}</p>}
      </div>
    </div>
  );
}
