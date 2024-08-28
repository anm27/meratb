import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../Header/Header';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URI}/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/dashboard');
        } catch (err) {
            console.error('Error during login:', err.response ? err.response.data : err.message);
            setError('Invalid credentials, please try again.');
        }
    };

    return (
        <>
        <Header />
        <div className="min-h-screen bg-[#122620] flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-[#1E2D2B] rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Login to Your Account</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                    {error && <p>{error}</p>}
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7] text-white"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7] text-white"
                            placeholder="********"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8AC9A7] hover:bg-[#78B694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8AC9A7]"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>


        
        </>
    );
};

export default Login;
