"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaLock,
  FaLockOpen,
  FaLightbulb,
  FaCheck,
  FaEraser,
  FaUserSecret,
  FaBoxOpen,
  FaDoorClosed,
} from "react-icons/fa";

// Replace with your actual API base URL
const API_BASE_URL = "https://locker.runnakjeen.com";

export default function ESPCam() {
  // State for controls
  // const [lockStatus, setLockStatus] = useState(false); // false = locked, true = unlocked
  const [boxStatus, setBoxStatus] = useState(false);   // false = closed, true = open
  const [ledStatus, setLedStatus] = useState(false);   // false = off, true = on
  const [password, setPassword] = useState("");
  const [activeSection, setActiveSection] = useState("status");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // State for image refresh and to avoid hydration errors
  const [timestamp, setTimestamp] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Set an initial timestamp on mount (will be the same on both server and client)
    setTimestamp(Date.now());
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // LED Toggle
  const handleToggleLED = async () => {
    const newStatus = !ledStatus;
    setLedStatus(newStatus);
    try {
      if (newStatus) {
        await fetch(`${API_BASE_URL}/light/on`, { method: "POST" });
      } else {
        await fetch(`${API_BASE_URL}/light/off`, { method: "POST" });
      }
    } catch (error) {
      console.error("Error toggling LED:", error);
    }
  };

  // Lock Toggle
  // const handleToggleLock = async () => {
  //   const newStatus = !lockStatus;
  //   setLockStatus(newStatus);
  //   try {
  //     if (newStatus) {
  //       await fetch(`${API_BASE_URL}/set/unlock_d?data=1`, { method: "POST" });
  //     } else {
  //       await fetch(`${API_BASE_URL}/set/lock_d?data=1`, { method: "POST" });
  //     }
  //   } catch (error) {
  //     console.error("Error toggling lock:", error);
  //   }
  // };

  // Box Toggle
  const handleToggleBox = async () => {
    const newStatus = !boxStatus;
    setBoxStatus(newStatus);
    try {
      if (newStatus) {
        await fetch(`${API_BASE_URL}/open_1`, { method: "POST" });
      } else {
        await fetch(`${API_BASE_URL}/close`, { method: "POST" });
      }
    } catch (error) {
      console.error("Error toggling box:", error);
    }
  };

  // Keypad input
  const handleKeyPress = (key) => {
    if (password.length < 4) {
      setPassword((prev) => prev + key);
    }
  };

  // Clear password
  const handleClear = () => {
    setPassword("");
  };

  // Submit password
  const handleSubmitPassword = async () => {
    try {
      setIsSuccessModalOpen(true);
      await fetch(`${API_BASE_URL}/pwd?data=${encodeURIComponent(password)}`, {
        method: "POST",
      });
      setPassword("");
    } catch (error) {
      console.error("Error submitting password:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-blue-500 text-white flex items-center justify-between p-4 relative">
        <Image
          src="/box-icon.png"
          alt="box"
          width={55}
          height={55}
          className="absolute left-4"
        />
        <h1 className="text-3xl font-bold mx-auto">กล่องสื่อรัก</h1>
      </div>

      {/* Subheader */}
      <div className="w-full flex items-center justify-between p-2 border-b">
        <span className="font-bold text-lg">ESP-CAM</span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full" />
          <div className="w-3 h-3 bg-blue-400 rounded-full" />
          <div className="w-3 h-3 bg-blue-400 rounded-full" />
        </div>
      </div>

      {/* Video Section */}
      <div className="relative w-full max-w-md flex justify-center">
        {hasMounted && (
          <Image
            src={`${API_BASE_URL}/image?t=${timestamp}`}
            alt="video"
            width={640}
            height={480}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex justify-center bg-blue-500 p-2 space-x-12">
        {/* LED / LOCK button */}
        <div className="flex flex-col items-center">
          <button
            className={`bg-white flex w-10 h-10 rounded-full items-center justify-center ${
              activeSection === "status" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setActiveSection("status")}
          >
            <img src="/bulblock.png" alt="picture" className="w-8 h-8" />
          </button>
          <div className="text-white mt-2 text-sm font-bold">LED / LOCK</div>
        </div>

        {/* PASSWORD button */}
        <div className="flex flex-col items-center">
          <button
            className={`bg-white w-10 h-10 rounded-full flex items-center justify-center ${
              activeSection === "password" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setActiveSection("password")}
          >
            <FaUserSecret className="w-8 h-8" />
          </button>
          <div className="text-white mt-2 text-sm font-bold">PASSWORD</div>
        </div>
      </div>

      {/* Conditional Rendering of Sections */}
      {activeSection === "status" && (
        <div className="w-full flex justify-around mt-6">
          {/* LED Status */}
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">LED</span>
            <button
              className={`w-16 h-16 flex items-center justify-center border-2 rounded-full mt-2 transition-all ${
                ledStatus ? "border-green-500" : "border-gray-500"
              }`}
              onClick={handleToggleLED}
            >
              <FaLightbulb
                className={`text-xl ${
                  ledStatus ? "text-green-500" : "text-gray-500"
                }`}
              />
            </button>
            <span className="mt-2">{ledStatus ? "On" : "Off"}</span>
          </div>

          {/* Lock Status */}
          {/* <div className="flex flex-col items-center">
            <span className="font-bold text-lg">Lock</span>
            <button
              className={`w-16 h-16 flex items-center justify-center border-2 rounded-full mt-2 transition-all ${
                lockStatus ? "border-green-500" : "border-red-500"
              }`}
              onClick={handleToggleLock}
            >
              {lockStatus ? (
                <FaLockOpen className="text-xl text-green-500" />
              ) : (
                <FaLock className="text-xl text-red-500" />
              )}
            </button>
            <span className="mt-2">
              {lockStatus ? "Unlocked" : "Locked"}
            </span>
          </div> */}

          {/* Box Status */}
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">Box</span>
            <button
              className={`w-16 h-16 flex items-center justify-center border-2 rounded-full mt-2 transition-all ${
                boxStatus ? "border-green-500" : "border-red-500"
              }`}
              onClick={handleToggleBox}
            >
              {boxStatus ? (
                <FaBoxOpen className="text-xl text-green-500" />
              ) : (
                <FaDoorClosed className="text-xl text-red-500" />
              )}
            </button>
            <span className="mt-2">{boxStatus ? "Open" : "Close"}</span>
          </div>
        </div>
      )}

      {activeSection === "password" && (
        <div className="w-full flex flex-col items-center p-4">
          {/* Password Input Row */}
          <div className="flex w-full border rounded-lg overflow-hidden text-center">
            <input
              type="text"
              value={password}
              readOnly
              maxLength={4}
              className="flex-1 p-2 text-lg border-none outline-none text-center"
            />
            {/* Clear Button */}
            <button onClick={handleClear} className="bg-red-500 p-3">
              <FaEraser className="text-white text-lg" />
            </button>
            {/* Confirm Button */}
            <button onClick={handleSubmitPassword} className="bg-blue-500 p-3">
              <FaCheck className="text-white text-lg" />
            </button>
          </div>

          {/* Keypad Container */}
          <div className="flex justify-center items-center w-full mt-4">
            <div className="grid grid-cols-3 gap-3 max-w-72">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""].map((key, index) => (
                <button
                  key={index}
                  onClick={() => key && handleKeyPress(key)}
                  className={`w-14 h-14 text-2xl font-bold text-white rounded-lg flex justify-center items-center 
                    transition-all duration-200 hover:scale-105 ${
                      key ? "bg-blue-500" : "bg-transparent pointer-events-none"
                    }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>



          {isSuccessModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-green-600">Password Set Successfully!</h2>
                <p className="mt-2 text-gray-600">Your new password has been saved.</p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsSuccessModalOpen(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
