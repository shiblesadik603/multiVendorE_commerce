"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      if (token) {
        setIsLoggedIn(true);
        setUserRole(role);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    // Check on initial load
    checkAuthStatus();

    // Listen for custom auth events across the app
    window.addEventListener('auth-change', checkAuthStatus);
    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('auth-change', checkAuthStatus);
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Broadcast logout signal
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  // Check if the current user has a seller role
  const isSeller = userRole?.toLowerCase() === 'seller' || userRole?.toLowerCase() === 'vendor';

  return (
    <header className="sticky top-0 z-50 bg-[#161616] text-white border-b border-zinc-800 shadow-md">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-xl font-black tracking-tight flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#82b440] inline-block"></span>
              <span className="text-white">multivendor</span>
              <span className="text-zinc-400 font-light">market</span>
            </Link>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-300">
            
            {/* Conditionally show Seller Dashboard only if logged in as a seller */}
            {isMounted && isLoggedIn && isSeller && (
              <Link href="/dashboard/products" className="hover:text-white transition-colors text-orange-400 font-bold">
                Seller Dashboard
              </Link>
            )}

            <Link href="/dashboard/seller" className="hover:text-white transition-colors">
              Start Selling
            </Link>
            <Link href="/products" className="hover:text-white transition-colors">
              Our Products
            </Link>
            <Link href="/cart" className="flex items-center space-x-1 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-md transition text-white">
              <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
            </Link>

            {/* Dynamic Auth Section gated by isMounted */}
            {isMounted && isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-[10px] uppercase bg-zinc-800 text-[#82b440] px-2.5 py-1 rounded font-bold border border-zinc-700 tracking-wider">
                  {userRole || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white px-3.5 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-zinc-800 text-white hover:bg-zinc-700 px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Categories Sub-Bar (Desktop) */}
      <div className="hidden md:block bg-[#1f1f1f] border-t border-zinc-800 text-xs font-medium text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 overflow-x-auto py-2.5">
          <Link href="/products" className="hover:text-white transition-colors text-white border-b-2 border-[#82b440] pb-0.5">
            All Items
          </Link>
          <Link href="/products" className="hover:text-white transition-colors">Electronics</Link>
          <Link href="/products" className="hover:text-white transition-colors">Fashion</Link>
          <Link href="/products" className="hover:text-white transition-colors">Home & Decor</Link>
          <Link href="/products" className="hover:text-white transition-colors">Gadgets</Link>
          <Link href="/products" className="hover:text-white transition-colors">Accessories</Link>
          <Link href="/products" className="hover:text-white transition-colors">AI & Digital Assets</Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#161616] border-t border-zinc-800 px-4 pt-3 pb-6 space-y-3">
          
          {/* Conditionally show Seller Dashboard in mobile menu */}
          {isMounted && isLoggedIn && isSeller && (
            <Link
              href="/dashboard/products"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-orange-400 hover:bg-zinc-800 transition"
            >
              Seller Dashboard
            </Link>
          )}

          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            Our Products
          </Link>
          <Link
            href="/dashboard/seller"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            Start Selling
          </Link>
          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            Cart
          </Link>
          <div className="pt-4 border-t border-zinc-800 flex flex-col space-y-2">
            {isMounted && isLoggedIn ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-center bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition"
              >
                Logout ({userRole || 'User'})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}