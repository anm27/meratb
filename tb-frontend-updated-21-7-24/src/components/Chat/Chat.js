import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
// import { receiveMessage, removeReceiveMessageListener } from '../../socket';

const socket = io(`${process.env.REACT_APP_SERVER_URI}`);

const Chat = ({ recipientId }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const typingTimeoutRef = useRef(null);
  const notificationSound = useRef(new Audio("/notification.mp3"));

  useEffect(() => {
    const audioElement = notificationSound.current;

    // Add event listeners to handle errors and success
    audioElement.addEventListener("canplaythrough", () => {
      console.log("Audio file can be played through");
    });
    audioElement.addEventListener("error", (e) => {
      console.error("Error loading audio file:", e);
      setError("Failed to load notification sound.");
    });

    if (user) {
      const token = localStorage.getItem("token");
      if (token) {
        socket.emit("join", token);
      }

      console.log("Setting up receiveMessage listener for user", user._id);

      socket.on("receiveMessage", ({ text, sender }) => {
        console.log("Received message:", { text, sender });
        setMessages((prevMessages) => [...prevMessages, { text, sender }]);
        // Play notification sound for new messages
        audioElement.play().catch((e) => {
          console.error("Error playing audio:", e);
          setError("Failed to play notification sound.");
        });
      });

      //   socket.on("typing", ({ senderId, recipientId, isTyping }) => {
      //     if (senderId === recipientId) {
      //       setTyping(isTyping);
      //     }
      //   });

      // Corrected condition to set typing status
      socket.on(
        "typing",
        ({ senderId, recipientId: typingRecipientId, isTyping }) => {
          if (typingRecipientId === user._id && senderId === recipientId) {
            setTyping(isTyping);
          }
        }
      );

      socket.on("errorMessage", (errorMsg) => {
        console.log("Error message from server:", errorMsg);
        setError(errorMsg);
      });

      return () => {
        console.log("Cleaning up receiveMessage listener for user", user._id);
        socket.off("receiveMessage");
        socket.off("typing");
        socket.off("errorMessage");
        audioElement.removeEventListener("canplaythrough", () => {});
        audioElement.removeEventListener("error", () => {});
      };
    }
  }, [user, recipientId]);

  const handleSendMessage = () => {
    const token = localStorage.getItem("token");
    const newMessage = {
      text: message,
      sender: user._id,
      recipient: recipientId,
    };
    console.log("Sending message:", newMessage);
    socket.emit("sendMessage", { recipientId, message: message, token });
    // setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'me' }]);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: user._id },
    ]);
    setMessage("");
    handleTyping(false);
  };

  const handleTyping = (isTyping) => {
    // const token = localStorage.getItem('token');
    socket.emit("typing", { recipientId, senderId: user._id, isTyping });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", {
          recipientId,
          senderId: user._id,
          isTyping: false,
        });
      }, 2000);
    }
  };

  return (
    <div className="bg-[#122620] text-white flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#fff]">
        Chat with {recipientId}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="w-full max-w-lg bg-[#1E2D2B] rounded-lg shadow-lg p-4 flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 overflow-auto h-[70vh]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md shadow-md ${
                msg.sender === user._id
                  ? "bg-[#8AC9A7] self-end text-black"
                  : "bg-[#2A3F3D] self-start text-white"
              }`}
            >
              <strong>{msg.sender === user._id ? "You" : msg.sender}:</strong>{" "}
              {msg.text}
            </div>
          ))}
        </div>
        {typing && (
          <p className="text-sm text-gray-400">{recipientId} is typing...</p>
        )}
        <p className="text-sm text-gray-400">
          Exchange mobile number for better communication
        </p>
        <div className="flex justify-between items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping(true);
            }}
            onBlur={() => handleTyping(false)}
            className="flex-1 px-4 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7]"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 h-10.5 bg-[#8AC9A7] w-1/5 text-black rounded-md hover:bg-[#78B694] focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
