import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineBell } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import Profile from "./Profile";
import { IoReorderThreeOutline } from "react-icons/io5";
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function TopNavbar({ setActiveSection, isLoggedIn, setIsLoggedIn, budgets, Income, Expense, theme, setTheme, setIsProfile, profileImage, isProfile, setProfileImage }) {
  const [Notification, setNotification] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState('');
  const totalExpense = Expense.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = Income.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = budgets.reduce((sum, item) => sum + item.amount, 0);
  const [ShowProfile, setShowProfile] = useState(false);
  const [isSideBar, setIsSideBar] = useState(false);
  const Navigate = useNavigate()
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastNotificationDate = localStorage.getItem('lastNotificationDate');
    creatingNotification();
    if (lastNotificationDate !== today) {
      setNotification(true);
      localStorage.setItem('lastNotificationDate', today);
    }
  }, []);

  const creatingNotification = () => {
    const prompt = `
    Please provide a short and motivational suggestion based on the user's financial data.
    The user’s monthly expense is ${totalExpense}, income is ${totalIncome}, and budget is ${totalBudget}. 
    Give advice or encouragement to help the user manage their finances better. 
    and give a different suggestion from ${message}
    Respond as a single sentence in plain text without any extra symbols or formatting.`;

    axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCmGM24OWDpPNvBhAKPmqx8WOeeUi6rc6c",
      { "contents": [{ "parts": [{ "text": prompt }] }] }
    )
      .then((response) => {
        const notify = response.data.candidates[0].content.parts[0].text;
        localStorage.setItem('Notification', notify);
        setMessage(notify);
      })
      .catch((error) => {
        console.log("There is some issue with the Bot, please try again later", error);
      });
  };

  const displayNotification = () => {
    setShowNotification(!showNotification);
    setNotification(false);
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSideBar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={sidebarRef}>
      <div ref={profileRef} className="flex items-center justify-between bg-white bg-opacity-90 backdrop-blur-md shadow-md p-4 w-full rounded-lg relative">
      {/* Left Side Placeholder (Logo or Title) */}
      <div  className="flex-1">
        {/* Hamburger Icon for small screens */}
        <div className="md:hidden block">
          {isLoggedIn?
          (<IoReorderThreeOutline className='w-8 h-10 cursor-pointer' onClick={(e) => {
            e.stopPropagation();
            setIsSideBar(!isSideBar)
          }} />):
          (null)}
          
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">

        {/* Notification Bell */}
        <div className="relative">
          <AiOutlineBell
            className="text-2xl cursor-pointer transition-transform transform hover:scale-110"
            title="Notifications"
            onClick={displayNotification}
          />
          {Notification && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 py-1 text-xs animate-pulse">
              1
            </span>
          )}
        </div>

        {/* Notification Popup */}
        {showNotification && (
          <div className="bg-white shadow-lg rounded-lg p-4 w-64 z-30 border border-gray-200 absolute top-12 right-4">
            <h1 className="text-lg font-semibold text-gray-800">Welcome to Expense Tracker!</h1>
            <p className="text-sm text-gray-600 mt-2">{message}</p>
          </div>
        )}

        {/* User Profile Icon */}
        <div className="relative">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              {/* Profile Icon */}
              <FaUserCircle
                className="text-3xl cursor-pointer hover:text-blue-500 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from propagating to the document
                  setShowProfile((prev) => !prev); // Properly toggle the dropdown visibility
                }}
              />

              {/* Profile Dropdown */}
              <span className="absolute top-16 right-2">
                {ShowProfile && (
                  <div className="bg-white  rounded-lg  md:w-96 w-64" onClick={(e) => e.stopPropagation()}>
                    <Profile
                      setIsProfile={setIsProfile}
                      profileImage={profileImage}
                      isProfile={isProfile}
                      setProfileImage={setProfileImage}
                      setIsLoggedIn={setIsLoggedIn}
                    />
                  </div>
                )}
              </span>
            </div>
          ) : (
            <div className="flex space-x-4">
              {/* Login and Signout Buttons */}
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300" onClick={() => { Navigate('/') }}>
                SignIn
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300" onClick={() => { Navigate('/login') }}>
                Login
              </button>
            </div>
          )}
        </div >


      </div >

      {/* Sidebar (toggle visibility based on isSideBar state) */}
      {isSideBar && (
        <div onClick={(e) => { e.stopPropagation() }} className="fixed top-16 left-0  bg-gray-800 text-white z-20 transition-transform transform md:hidden block">
          <Navbar setActiveSection={setActiveSection} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profileImage={profileImage} setProfileImage={setProfileImage} setIsSideBar={setIsSideBar} />
        </div>
      )}
    </div>

    </div>
    
  );
}

export default TopNavbar;
