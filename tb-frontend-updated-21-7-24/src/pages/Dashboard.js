import React, { useContext, useEffect, useRef, useState } from "react";
import SubmitDetails from "../components/Travel/SubmitDetails";
import TravelRequests from "../components/Travel/TravelRequests";
import Chat from "../components/Chat/Chat";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import Header from "../components/Header/Header";

import Modal from "../components/Modal/Modal";
// import axios from "axios";

const socket = io(`${process.env.REACT_APP_SERVER_URI}`);

const Dashboard = () => {
  const matchedUsersRef = useRef(null);
  const travelRequestsRef = useRef(null);

  const { user } = useContext(AuthContext);

  //   const [incomingRequests, setIncomingRequests] = useState([]);
  //   const [acceptedUsers, setAcceptedUsers] = useState([]);

  const [chatRecipient, setChatRecipient] = useState(null);
  const [matchedUsersCount, setMatchedUsersCount] = useState(0);
  const [travelRequestCount, setTravelRequestCount] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [allTravelDetails, setAllTravelDetails] = useState([]);

  const scrollToMatchedUsers = () => {
    if (matchedUsersRef.current) {
      matchedUsersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTravelRequests = () => {
    if (travelRequestsRef.current) {
      travelRequestsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (user) {
      console.log("Joining room for userrr", user._id);
      socket.emit("join", localStorage.getItem("token"));
    }

    // Listen for incoming travel requests
    // socket.on("receiveTravelRequest", (data) => {
    //   setIncomingRequests((prev) => [...prev, data]);
    // });

    // Listen for request acceptance
    // socket.on("requestAccepted", (data) => {
    //   if (data.recipientId === user._id || data.senderId === user._id) {
    //     setAcceptedUsers((prev) => [...prev, data.recipientId, data.senderId]);
    //     setChatRecipient(
    //       data.senderId === user._id ? data.recipientId : data.senderId
    //     );
    //   }
    // });

    return () => {
      socket.off("receiveTravelRequest");
      socket.off("requestAccepted");
    };
  }, [user]);

  const handleSendRequest = (recipientId) => {
    socket.emit("sendTravelRequest", {
      senderId: user._id,
      recipientId,
      pickupLocation: "Your Pickup Location",
      dropLocation: "Your Drop Location",
    });
    alert("Travel Request Sent!");
  };

  //   const handleAcceptRequest = (senderId) => {
  //     socket.emit("acceptTravelRequest", { recipientId: user._id, senderId });
  //   };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleRecipientSelected = (recipientId) => {
    console.log(`Chat recipient selected: ${recipientId}`);
    setChatRecipient(recipientId);
  };

  // Function to fetch all users' travel details except the current user
  const fetchAllTravelDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URI}/travel/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response status is not OK (200-299 range)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check if data is an array before setting the state
      if (Array.isArray(data)) {
        setAllTravelDetails(data);
      } else {
        console.error("Expected an array but got:", data);
        setAllTravelDetails([]); // Set an empty array to avoid map errors
      }
    } catch (err) {
      console.error("Error fetching travel details:", err);
    }
  };

  // Handle showing the modal
  const handleShowModal = () => {
    fetchAllTravelDetails();
    setIsModalVisible(true);
  };

  return (
    <div>
      <Header
        matchedUsersCount={matchedUsersCount}
        travelRequestCount={travelRequestCount}
        scrollToMatchedUsers={scrollToMatchedUsers}
        scrollToTravelRequests={scrollToTravelRequests}
      />
      <h2 className="text-white text-xl text-center">
        Welcome, {user.username}
      </h2>

      <h1 className="text-white text-center text-sm px-2">
        Find your{" "}
        <span className="text-green-700"> perfect travel companion </span> and
        save minimum 50% 🤓 cost on cab rides with MeraTravelBuddy. Share your
        journey, cut costs, and make new connections.{" "}
        <span className="text-blue-500">
          Book your ride / plan your journey{" "}
        </span>{" "}
        with matched travelers today!
      </h1>

      <button className="text-center w-full underline text-blue-300 cursor-pointer mt-2">
        See how it works. (DEMO OF APP)
      </button>

      <SubmitDetails />

      {/* {incomingRequests.map((request) => (
        <div key={request.senderId}>
          <p>{request.senderId} sent you a travel request.</p>
          <button onClick={() => handleAcceptRequest(request.senderId)}>
            Accept
          </button>
        </div>
      ))} */}

      {/* {acceptedUsers.includes(chatRecipient) && (
        <Chat recipientId={chatRecipient} />
      )} */}

      <TravelRequests
        onRecipientSelected={handleRecipientSelected}
        onMatchedUsersCount={setMatchedUsersCount}
        onTravelRequestCount={setTravelRequestCount}
        matchedUsersRef={matchedUsersRef}
        travelRequestsRef={travelRequestsRef}
      />

      {chatRecipient && <Chat recipientId={chatRecipient} />}

      <div className="fixed bottom-0 right-0 z-50">
        <h2
          className="bg-blue-600 hover:bg-blue-800 transition text-white font-semibold py-1 px-3 cursor-pointer rounded-md"
          onClick={handleShowModal}
        >
          Show All Users Travel Details
        </h2>
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <h2 className="font-bold text-xl mb-4 text-purple-600">
          All Users Travel Details :
        </h2>
        {allTravelDetails.length === 0 ? (
          <p className="text-white">No travel details available.</p>
        ) : (
          <ul>
            {allTravelDetails.map((detail) => (
              <div className="border-b-2 shadow-md pb-6 pt-6">
                <li key={detail._id} className="text-white mb-2 text-justify">
                  <span className="uppercase font-bold">
                    "{detail.userId.username}"
                  </span>{" "}
                  wants to travel from{" "}
                  <span className="uppercase font-bold text-yellow-400">
                    {detail.pickupLocation}{" "}
                  </span>{" "}
                  <span className="text-2xl">➖</span>
                  <span className="uppercase font-bold text-green-400">
                    {" "}
                    {detail.dropLocation}{" "}
                  </span>
                  .
                </li>

                <li key={detail._id} className="text-white mb-2">
                  Travelling on:{" "}
                  <span className="uppercase font-bold text-blue-300">
                    {" "}
                    "{detail.timeSlot}"
                  </span>
                </li>

                <button
                  className="bg-green-600 hover:bg-green-800 text-white font-semibold py-1 px-3 flex justify-center w-full rounded-md text-xl"
                  onClick={() => handleSendRequest(detail.userId._id)} // Send request on click
                >
                  Send Request
                </button>
              </div>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
