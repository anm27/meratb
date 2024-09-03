import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
import Modal from "../Modal/Modal";
// import Header from '../Header/Header';

const socket = io(`${process.env.REACT_APP_SERVER_URI}`);

const TravelRequests = ({
  onRecipientSelected,
  onMatchedUsersCount,
  onTravelRequestCount,
  matchedUsersRef,
  travelRequestsRef,
}) => {
  const [requests, setRequests] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      console.log("User is available, setting up socket listeners", user);

      // Join the socket room with user ID
      const token = localStorage.getItem("token");
      console.log("Joining socket room with token:", token);
      socket.emit("join", token);

      socket.on("newMatch", (matches) => {
        console.log("Received newMatch event with matches:", matches);
        setMatchedUsers(matches);
        onMatchedUsersCount(matches.length);
      });

      // socket.on('receiveTravelRequest', (request) => {
      //     console.log('Received travel request:', request);
      //     setRequests((prevRequests) => [...prevRequests, request]);
      //     console.log("Request Count: ", request);
      //     onTravelRequestCount(request.length);
      // });

      socket.on("receiveTravelRequest", (request) => {
        console.log("Received travel request:", request);
        setRequests((prevRequests) => {
          const updatedRequests = [...prevRequests, request];
          onTravelRequestCount(updatedRequests.length); // Pass the count to Header
          return updatedRequests;
        });
      });

      socket.on("requestAccepted", (data) => {
        console.log("Request accepted:", data);
        setAcceptedRequests((prevAcceptedRequests) => [
          ...prevAcceptedRequests,
          data,
        ]);
        if (data.senderId === user._id) {
          console.log(`Setting recipient to ${data.recipientId}`);
          onRecipientSelected(data.recipientId);
        } else if (data.recipientId === user._id) {
          console.log(`Setting recipient to ${data.senderId}`);
          onRecipientSelected(data.senderId);
        }
        // alert('Request accepted');
        setModalMessage("Request Accepted! Chat, Meet, Travel & share fare.");
        setShowModal(true);
      });

      // Clean up the socket listeners on component unmount
      return () => {
        console.log("Cleaning up socket listeners");
        socket.off("newMatch");
        socket.off("receiveTravelRequest");
        socket.off("requestAccepted");
      };
    }
  }, [user, onRecipientSelected, onMatchedUsersCount, onTravelRequestCount]);

  const handleSendRequest = (recipientId) => {
    const token = localStorage.getItem("token");
    const senderId = user._id; // Ensure senderId is available
    console.log(
      "Sending travel request to:",
      recipientId,
      "from:",
      senderId,
      "with token:",
      token
    );
    socket.emit("sendTravelRequest", {
      recipientId,
      senderId,
      pickupLocation: "Your Pickup Location",
      dropLocation: "Your Drop Location",
    });
    // alert('Travel request sent');
    setModalMessage("Travel request sent");
    setShowModal(true);
  };

  const handleAcceptRequest = (request) => {
    const recipientId = user._id;
    const senderId = request.senderId;
    console.log("Accepting travel request:", request);
    socket.emit("acceptTravelRequest", { recipientId, senderId });
    onRecipientSelected(request.senderId);
  };

  const isRequestAccepted = (userId) => {
    return acceptedRequests.some(
      (request) => request.senderId === userId || request.recipientId === userId
    );
  };

  return (
    <div
      ref={matchedUsersRef}
      className="min-h-10 bg-[#122620] text-white p-8 "
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          Matched Users
        </h2>
        <ul className="lg:flex gap-2 justify-center">
          <div className="text-white font-bold text-2xl text-center">
            {!matchedUsers && "Searching..."}
          </div>
          {matchedUsers.length > 0 ? (
            matchedUsers.map((user) => (
              <li
                key={user._id}
                className="bg-[#1E2D2B] p-4 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 grid justify-center items-center gap-2 py-3"
              >
                <div>
                  <div className="tracking-wider">
                    <p className="text-lg font-medium mb-2">
                      Username:{" "}
                      <span className="text-purple-400 hover:text-blue-500">
                        {user.userId.username}{" "}
                        <a href={`tel:${user.phone}`} target="blank">
                          ({user.phone})
                        </a>
                      </span>
                    </p>
                    <p className="text-sm">
                      Going to travel from{" "}
                      <span className="text-yellow-400">
                        {" "}
                        {user.pickupLocation}{" "}
                      </span>{" "}
                      ➖{" "}
                      <span className="text-green-400">
                        {" "}
                        {user.dropLocation}{" "}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      Travelling on:{" "}
                      <span className="text-blue-300 font-semibold">
                        "{user.timeSlot}"
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="bg-[#2ace77] w-46 text-black px-4 py-2 mt-2 font-semibold text-xl rounded-lg hover:bg-[#45f293] focus:outline-none"
                >
                  Send Travel Request
                </button>
              </li>
            ))
          ) : (
            <p className="text-lg text-white">Searching...</p>
          )}
        </ul>

        <Modal isVisible={!!selectedUser} onClose={() => setSelectedUser(null)}>
          {selectedUser && (
            <div
              ref={travelRequestsRef}
              className="flex justify-center items-center"
            >
              <div className="mt-8 bg-[#1E2D2B] p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Send Travel Request to {selectedUser.userId.username}
                </h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleSendRequest(selectedUser.userId._id)}
                    className="bg-[#8AC9A7] text-black px-4 py-2 rounded-lg hover:bg-[#78B694] focus:outline-none"
                  >
                    Send Request
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <div className="flex justify-center items-center">
            <div className="bg-[#1E2D2B] p-6 rounded-lg shadow-lg w-full text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">
                {modalMessage}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#8AC9A7] text-black px-4 py-2 rounded-lg hover:bg-[#78B694] focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-white text-center">
          Received Requests
        </h2>
        <ul className="lg:flex grid gap-2 justify-center items-center">
          {requests.map((request, index) => (
            <li
              key={index}
              className="bg-[#1E2D2B] p-4 rounded-lg shadow-lg grid justify-center items-center"
            >
              <div>
                <p className="text-lg font-medium">{request.senderId}</p>
                <p className="text-sm">
                  {request.pickupLocation} to {request.dropLocation}
                </p>
              </div>
              <div className="flex space-x-4">
                {!isRequestAccepted(request.senderId) && (
                  <button
                    onClick={() => handleAcceptRequest(request)}
                    className="bg-[#8AC9A7] text-black px-4 py-2 rounded-lg hover:bg-[#78B694] focus:outline-none"
                  >
                    Accept
                  </button>
                )}
                {!isRequestAccepted(request.senderId) && (
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 focus:outline-none">
                    Reject
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TravelRequests;
