import axios from 'axios';

export const register = async (userData) => {
    await axios.post(`${process.env.REACT_APP_SERVER_URI}/auth/register`, userData);
};

export const login = async (userData) => {
    const res = await axios.post(`${process.env.REACT_APP_SERVER_URI}/auth/login`, userData);
    localStorage.setItem('token', res.data.token);
    return res.data;
};
