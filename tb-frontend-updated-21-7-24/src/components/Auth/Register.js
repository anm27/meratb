import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URI}/auth/register`, {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[80vh] bg-[#122620] flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-[#1E2D2B] rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Register
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              {/* {error && <p>{error}</p>} */}
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                // id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7] text-white"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              {/* {error && <p>{error}</p>} */}
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                // id="email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7] text-white"
                placeholder="Enter username of your choice"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                // id="password"
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
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
    // <form onSubmit={handleRegister}>
    //     <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
    //     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
    //     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
    //     <button type="submit">Register</button>
    // </form>
  );
};

export default Register;
