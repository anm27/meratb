import React from "react";

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1E2D2B] p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative max-h-[90vh] overflow-auto">
        <div className="sticky top-0 right-0 flex justify-end">
          <button
            className="text-black text-2xl focus:outline-none bg-white px-2 rounded-full font-semibold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
