import ChatbaseBot from '@/componentes/ChatbaseBot';
import React from 'react'
export const Footer = () => {
    return (
      <footer className="bg-gray-800/95 backdrop-blur-md text-white text-center py-8 mt-12">
        <ChatbaseBot />
        <p>&copy; 2025 Terrago. Comparamos para que tú encuentres el mejor precio en terrenos.</p>
      </footer>
    );
};