import React, { useEffect, useState } from 'react';
import Logout from '../Auth/Logout';
// import { AuthContext } from '../../context/AuthContext';

const taglines = [
    "Match, Chat, Share Travel Fare",
    "Travel Together, Save Together",
    "Share the Journey, Share the Fare",
    "Connecting Travelers, Cutting Costs",
    "Affordable Travel, One Match at a Time",
    "Join the Ride, Split the Fare",
    "Travel Buddy: Your Partner in Savings",
    "Ride Together, Pay Less",
    "Find Your Travel Mate, Share Your Travel Rate",
    "Better Journeys, Shared Fares",
    "Travel Smarter, Together"
];

const Header = ({ matchedUsersCount, travelRequestCount, scrollToMatchedUsers, scrollToTravelRequests }) => {
    // const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');
    const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
        <div className='bg-[#11201b] flex justify-between items-center lg:px-3 mb-3 w-full sticky top-0 z-50'>
            <header className="flex justify-center my-3">
                <img src="/travelbuddy.png" alt="TravelBuddy Logo" className="w-20" />
            </header>
            <ul className='grid justify-between items-center h-20'>

                {token ? 
                    <>
                    <div className='lg:flex justify-center items-center gap-4'>
                        <div className='flex'>
                            <div className='text-base text-white cursor-pointer' onClick={scrollToMatchedUsers}>Matched Users</div>
                            <div className='bg-green-600 text-white w-6 h-6 -translate-y-2  flex items-center justify-center rounded-full font-bold'>{matchedUsersCount}</div>
                        </div>
                        {/* <div className='text-base text-white'>Travel Requests</div> */}
                        <div className='flex'>
                            <div className='text-base text-white cursor-pointer' onClick={scrollToTravelRequests}>Travel Requests</div>
                            <div className='bg-green-600 text-white w-6 h-6 -translate-y-2  flex items-center justify-center rounded-full font-bold'>{travelRequestCount}</div>
                        </div>
                        <Logout /> 
                    </div>
                    </>
                        : 
                    <li className='text-white text-2xl pr-2'>{taglines[currentTaglineIndex]}</li>}
            </ul>
        </div>
        </>
    );
};

export default Header;