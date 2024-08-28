import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Logout = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <button className='text-white bg-red-500 rounded-md hover:bg-red-800 w-20 py-1' onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
