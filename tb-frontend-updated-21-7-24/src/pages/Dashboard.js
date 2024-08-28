import React, { useContext, useEffect, useRef, useState } from 'react';
import SubmitDetails from '../components/Travel/SubmitDetails';
import TravelRequests from '../components/Travel/TravelRequests';
import Chat from '../components/Chat/Chat';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import Header from '../components/Header/Header';

const socket = io(`${process.env.REACT_APP_SERVER_URI}`);

const Dashboard = () => {
    const matchedUsersRef = useRef(null);
    const travelRequestsRef = useRef(null);

    const { user } = useContext(AuthContext);
    const [chatRecipient, setChatRecipient] = useState(null);
    const [matchedUsersCount, setMatchedUsersCount] = useState(0);
    const [travelRequestCount, setTravelRequestCount] = useState(0);

    const scrollToMatchedUsers = () => {
        if (matchedUsersRef.current) {
            matchedUsersRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTravelRequests = () => {
        if (travelRequestsRef.current) {
            travelRequestsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
 
    useEffect(() => {
        if (user) {
            console.log('Joining room for userrr', user._id);
            socket.emit('join', localStorage.getItem('token'));
        }
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleRecipientSelected = (recipientId) => {
        console.log(`Chat recipient selected: ${recipientId}`);
        setChatRecipient(recipientId);
    };

    return (
        <div>
            <Header matchedUsersCount={matchedUsersCount} travelRequestCount={travelRequestCount} scrollToMatchedUsers={scrollToMatchedUsers} scrollToTravelRequests={scrollToTravelRequests}  />
            <h1 className='text-white text-xl text-center'>Welcome, {user.username}</h1>

            <SubmitDetails />

            <TravelRequests onRecipientSelected={handleRecipientSelected} onMatchedUsersCount={setMatchedUsersCount} onTravelRequestCount={setTravelRequestCount} matchedUsersRef={matchedUsersRef} travelRequestsRef={travelRequestsRef} />

            {chatRecipient && <Chat recipientId={chatRecipient}  />}
        </div>
    );
};

export default Dashboard;
