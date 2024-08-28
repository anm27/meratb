import axios from 'axios';

export const submitTravelDetails = async (details) => {
    const token = localStorage.getItem('token');
    await axios.post(`${process.env.REACT_APP_SERVER_URI}/travel/submitDetails`, details, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
