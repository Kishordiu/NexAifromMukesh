import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [user, setUser] = useState(null);
 const [token, setToken] = useState(localStorage.getItem('diumed_token'));
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 const validateToken = async () => {
 if (!token) {
 setIsLoading(false);
 return;
 }

 try {
 const data = await api.auth.me();
 setUser(data.user);
 setIsAuthenticated(true);
 } catch (error) {
 console.error('Token validation failed:', error);
 localStorage.removeItem('diumed_token');
 setToken(null);
 setUser(null);
 setIsAuthenticated(false);
 } finally {
 setIsLoading(false);
 }
 };

 validateToken();
 }, [token]);

 const login = async (email, password) => {
 const response = await api.auth.login(email, password);
 localStorage.setItem('diumed_token', response.token);
 setToken(response.token);
 setUser(response.user);
 setIsAuthenticated(true);
 };

 const register = async (email, password) => {
 const response = await api.auth.register(email, password);
 localStorage.setItem('diumed_token', response.token);
 setToken(response.token);
 setUser(response.user);
 setIsAuthenticated(true);
 };

 const logout = () => {
 localStorage.removeItem('diumed_token');
 setToken(null);
 setUser(null);
 setIsAuthenticated(false);
 window.location.href = '/login';
 };

 const updateUser = (data) => {
 setUser((prev) => ({ ...prev, ...data }));
 };

 const value = {
 user,
 token,
 isAuthenticated,
 isLoading,
 login,
 register,
 logout,
 updateUser,
 };

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
 throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};
