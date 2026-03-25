"use client";

import React, { useEffect, useState } from "react";

const DeviceRestrictionModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setShowModal(window.innerWidth > 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-[100000]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Screen Too Large</h2>
        <p>Please switch to a mobile or tablet device for the best experience.</p>
      </div>
    </div>
  );
};

export default DeviceRestrictionModal;
