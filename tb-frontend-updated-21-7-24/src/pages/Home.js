import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <img
          src="/travelbuddy.png"
          alt="TravelBuddy Logo"
          className="w-20 m-auto"
        />
        <h1 className="text-white my-4 text-center">Welcome to TravelBuddy</h1>
        <div className="flex gap-3 justify-center">
          <Link
            className="bg-green-400 hover:bg-green-600 p-2 px-5"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="bg-cyan-400 hover:bg-cyan-600 p-2 px-5"
            to="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
