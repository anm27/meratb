import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debug token
            if (token) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_SERVER_URI}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log('User Data:', res.data); // Debug response
                    setUser(res.data);
                } catch (err) {
                    console.error('Error fetching user:', err.response ? err.response.data : err.message);
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login'); // Redirect to login if token is invalid
                    }
                }
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
