import React from 'react';
import { Header } from '../MainPage/Header';
import { Footer } from '../MainPage/Footer';

export const LayoutMain = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-50 to-amber-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 text-neutral-800 dark:text-neutral-100">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};