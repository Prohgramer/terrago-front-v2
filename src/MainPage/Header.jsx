import React, { useEffect } from 'react'
import { useAuth } from '../routes/AuthProvider';
import { motion } from "framer-motion";
import { Trees, Moon, Sun,Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link, useLocation } from 'react-router-dom';
import { LoginPrompt } from '@/components/LoginPrompt';
import { useTheme } from '../context/ThemeContext';

export const Header = ({ onSectionChange }) => {
    const { dark, setDark } = useTheme();
    const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
    const { loggedIn, user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
      const hasClosedPrompt = localStorage.getItem('hasClosedLoginPrompt');
      if (!loggedIn && !hasClosedPrompt) {
        const timer = setTimeout(() => {
          setShowLoginPrompt(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [loggedIn]);

    const handleClosePrompt = () => {
      setShowLoginPrompt(false);
      localStorage.setItem('hasClosedLoginPrompt', 'true');
    };

    return (
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/70 border-b border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <motion.div 
                initial={{ scale: 0.9 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", stiffness: 120 }} 
                className="w-9 h-9 grid place-content-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow"
              >
                <Trees className="w-5 h-5" />
              </motion.div>
              <span className="font-extrabold tracking-tight text-xl">TERRAGO</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link 
              to="/" 
              className={`opacity-80 hover:opacity-100 ${location.pathname === '/' ? 'font-medium' : ''}`}
            >
              Inicio
            </Link>
            {loggedIn && (
              <Link 
                to="/recomendaciones" 
                className={`opacity-80 hover:opacity-100 ${location.pathname === '/recomendaciones' ? 'font-medium' : ''}`}
              >
                Recomendaciones
              </Link>
            )}
            <a className="opacity-80 hover:opacity-100" href="#mapa">Mapa</a>
            {loggedIn && user?.type_user === "admin" && (
              <Link
                to="/admin"
                className={`opacity-80 hover:opacity-100 ${location.pathname === '/admin' ? 'font-medium' : ''}`}
              >
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <Switch checked={dark} onCheckedChange={setDark} id="theme-switch" />
              <Sun className="w-4 h-4" />
            </div>
            {loggedIn ? (
              <>
              <Link to="/account">
                <Button variant="ghost" size="icon" className="rounded-2xl">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
                <Button variant="outline" className="rounded-2xl" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      className="rounded-2xl"
                    >
                      Iniciar sesión
                    </Button>
                  </Link>

                </div>
                <LoginPrompt 
                  isVisible={showLoginPrompt} 
                  onClose={handleClosePrompt} 
                />
              </div>
            )}
          </div>
        </div>
      </header>
    );
};