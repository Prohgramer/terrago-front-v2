import React from 'react';
import { Header } from '../MainPage/Header';
import { Footer } from '../MainPage/Footer';
import Recommendations from '../componentes/recommendations';
import { useAuth } from '../routes/AuthProvider';

export const RecommendationsPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-emerald-50 to-amber-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 text-neutral-800 dark:text-neutral-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Recomendaciones Personalizadas</h1>
        <Recommendations userId={user?.id || '68e41f2d874abe0c14b860ba'} />
      </main>
      <Footer />
    </div>
  );
};