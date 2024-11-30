import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaChartLine, FaWallet, FaClipboardList, FaFileAlt } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import noneProfile from "../ProfileAvatar/noneProfile.webp";
import maleImage from "../ProfileAvatar/male_Image.avif";
import femaleImage from "../ProfileAvatar/female_Image.jpg";

function Navbar({ setActiveSection, isLoggedIn, setIsLoggedIn, profileImage, setProfileImage,setIsSideBar = () => {} }) {
    const UserName = localStorage.getItem("name");

    useEffect(() => {
        const gender = localStorage.getItem("gender");

        // Set the profile image based on gender
        
            if (gender === "male") {
                setProfileImage(maleImage);
            } else if (gender === "female") {
                setProfileImage(femaleImage);
            } else {
                setProfileImage(noneProfile); // Default to noneProfile for 'none' or undefined
            }
        
        
    }, [setProfileImage]); // Only run this effect when setProfileImage changes (or on mount)

    const SignOutHandler = () => {
        axios.post("https://expensemanager-1-0p9e.onrender.com/user/signout", {}, { withCredentials: true })
            .then((response) => {
                localStorage.removeItem('isLoggedIn');
                setIsLoggedIn(false);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error during sign out:", error);
            });
    };

    return (
        <div className="fixed top-0 left-0 md:w-64 w-56 h-[100vh] bg-gray-50 text-gray-800 shadow-lg rounded-r-lg flex flex-col p-6 space-y-6 z-10 border border-gray-200">
            {/* Profile Section */}
            <div className="flex flex-col items-center space-y-4 md:mb-6 mb-4">
                {isLoggedIn?
                (<img
                    src={profileImage}
                    alt="User Profile"
                    className="md:w-20 md:h-20 w-16 h-16 rounded-full shadow-lg border-4 border-indigo-500"
                />):
                (<img
                    src={noneProfile}
                    alt="User Profile"
                    className="md:w-20 md:h-20 w-16 h-16 rounded-full shadow-lg border-4 border-indigo-500"
                />)}
                

                
                <span className="text-gray-700 text-lg font-semibold">{UserName}</span>
            </div>

            <h2 className="md:text-2xl text-xl font-bold text-indigo-600 cursor-pointer md:mb-4 mb-2" onClick={() => {
                setActiveSection('MainPage')
                setIsSideBar(false);
            }}>
                Dashboard
            </h2>

            {/* Navigation */}
            <nav className="space-y-4">
                <button onClick={() => {
                    setActiveSection('Income')
                    setIsSideBar(false);
                }} className="flex items-center space-x-2 text-lg text-gray-800 hover:bg-indigo-500 hover:text-white transition-all duration-200 p-2 rounded">
                    <FaChartLine />
                    <span>Income</span>
                </button>
                <button onClick={() => {
                    setActiveSection('Budget')
                    setIsSideBar(false);
                }} className="flex items-center space-x-2 text-lg text-gray-800 hover:bg-indigo-500 hover:text-white transition-all duration-200 p-2 rounded">
                    <FaWallet />
                    <span>Budget</span>
                </button>
                <button onClick={() => {
                    setActiveSection('Expenses')
                    setIsSideBar(false);
                }} className="flex items-center space-x-2 text-lg text-gray-800 hover:bg-indigo-500 hover:text-white transition-all duration-200 p-2 rounded">
                    <FaClipboardList />
                    <span>Expenses</span>
                </button>
                
                <button onClick={() => {
                    setActiveSection('Manager')
                    setIsSideBar(false);
                }} className="flex items-center space-x-2 text-lg text-gray-800 hover:bg-indigo-500 hover:text-white transition-all duration-200 p-2 rounded">
                    <FaFileAlt />
                    <span>contri Manager</span>
                </button>

                {/* <button onClick={() => setActiveSection('profile')} className="flex items-center space-x-2 text-lg text-gray-800 hover:bg-indigo-500 hover:text-white transition-all duration-200 p-2 rounded">
                <CgProfile />
                    <span>Profile</span>
                </button> */}

                {isLoggedIn ? (
                    <button className="flex items-center space-x-2 text-lg text-red-500 hover:bg-red-600 hover:text-white transition-all duration-200 p-2 rounded" onClick={SignOutHandler}>
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                    </button>
                ) : (
                    null
                )}
            </nav>
        </div>
    );
}

export default Navbar;
