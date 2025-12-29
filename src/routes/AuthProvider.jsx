import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // Verificar localStorage al iniciar
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('userData');
        
        if (token && savedUser) {
            setLoggedIn(true);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData) => {
        setLoggedIn(true);
        setUser(userData || { name: 'Usuario' });
        // No necesitamos guardar aquí porque ya se guarda en LoginPage
    };

    const logout = () => {
        setLoggedIn(false);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    };

    // Add updateUser function
    const updateUser = (userData) => {
        setUser(userData);
        // Optionally update localStorage if you're storing user data there
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ 
            loggedIn, 
            user, 
            login, 
            logout,
            setUser, 
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};