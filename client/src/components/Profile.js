import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from "react-icons/fa";
import femaleImage from '../ProfileAvatar/female_Image.jpg';
import maleImage from '../ProfileAvatar/male_Image.avif';
import noneProfile from "../ProfileAvatar/noneProfile.webp";
import { useNavigate } from 'react-router-dom';

function Profile({ setIsProfile, profileImage, isProfile, setProfileImage, setIsLoggedIn }) {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [isChangeName, setIsChangeName] = useState(false);
    const [isChangeEmail, setIsChangeEmail] = useState(false);
    const [newData, setNewData] = useState({ name: '', email: '' });
    const [isEmailChange, setIsEmailChange] = useState(false);
    const [gender, setGender] = useState(localStorage.getItem("gender") || "none"); // Retrieve gender from localStorage

    const id = localStorage.getItem('email');

    useEffect(() => {
        // Set profile image based on stored gender
        if (gender === "male") {
            setProfileImage(maleImage);
        } else if (gender === "female") {
            setProfileImage(femaleImage);
        } else {
            setProfileImage(noneProfile);
        }

        // Fetch user data
        axios.get(`https://expensemanager-1-0p9e.onrender.com/user/getUser/${id}`, { withCredentials: true })
            .then((response) => {
                const userData = response.data.response;
                setName(userData.name);
                setEmail(userData.email);
                setNewData({ name: userData.name, email: userData.email });
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
    }, [id, gender]);

    const updateGenderInBackend = (newGender) => {
        axios.patch(`https://expensemanager-1-0p9e.onrender.com/user/editGender/${email}/${newGender}`, {}, { withCredentials: true })
            .then((response) => {
                console.log("Gender updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error updating gender:", error);
            });
    };

    const toggleProfileImage = () => {
        let newGender;

        if (gender === "none" || gender === "female") {
            // Switch to male
            newGender = "male";
            setProfileImage(maleImage);
        } else if (gender === "male") {
            // Switch to female
            newGender = "female";
            setProfileImage(femaleImage);
        }

        // Update gender state and backend
        setGender(newGender);
        localStorage.setItem("gender", newGender);
        updateGenderInBackend(newGender);
    };

    

    const SignOutHandler = () => {
        axios.post("https://expensemanager-1-0p9e.onrender.com/user/signout", {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem('isLoggedIn');
                setIsLoggedIn(false);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error during sign out:", error);
            });
    };

    const changeNameHandler = () => {
        axios.patch(`https://expensemanager-1-0p9e.onrender.com/user/UpdateName/${email}`, { name: newData.name }, { withCredentials: true })
            .then(() => {
                setName(newData.name);
                setIsChangeName(false);
                localStorage.setItem("name",newData.name);
                window.location.reload();
            })
            .catch((error) => console.error("Error updating name:", error));
    };

    const changeEmailHandler = () => {
        let OTP = Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem('otp', OTP);
        axios.patch(`https://expensemanager-1-0p9e.onrender.com/user/EmailVerify/${newData.email}/${OTP}`, { withCredentials: true })
            .then(() => {
                setIsChangeEmail(false);
                setIsEmailChange(true);
            })
            .catch((error) => console.error("Error updating email:", error));
    };

    const onChangeHandler = (event) => {
        setNewData({ ...newData, [event.target.name]: event.target.value });
    };

    const OTPHandler = (e) => {
        e.preventDefault();
        const otpValue = e.target[0].value;
        const storedOtp = localStorage.getItem('otp');
        if (otpValue === storedOtp) {
            alert("OTP Verified Successfully!");
            setIsEmailChange(false);
            axios.patch(`https://expensemanager-1-0p9e.onrender.com/user/editEmail/${email}`, { email: newData.email }, { withCredentials: true })
                .then(() => {
                    console.log("Email updated successfully.");
                    setEmail(newData.email);
                });
        } else {
            alert("Incorrect OTP. Try again.");
        }
    };


    return (
        <div className="flex justify-center items-center">
            <div className="bg-white shadow-2xl rounded-3xl p-6 max-w-md w-full md:max-w-xl">
                <div className="text-center mb-8">
                    <div>
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-16 h-16 sm:w-28 sm:h-28 rounded-full mx-auto object-cover border-4 border-indigo-500 shadow-lg cursor-pointer"
                            onClick={toggleProfileImage} // Toggles the profile image on click
                        />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-4">Your Profile</h1>
                    <p className="text-gray-500">Manage your account details</p>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-6">
                    {/* Name Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Name:</h2>
                        <div className="flex flex-row items-center sm:space-x-4">
                            {isChangeName ? (
                                <input
                                    className="border border-gray-300 rounded-xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    type="text"
                                    name="name"
                                    value={newData.name}
                                    onChange={onChangeHandler}
                                />
                            ) : (
                                <p className="text-xl text-gray-600 flex-grow">{name || 'Loading...'}</p>
                            )}
                            <button
                                className={`mt-3 sm:mt-0 px-4 py-2 rounded-xl text-white shadow-md transition ${isChangeName ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                onClick={isChangeName ? changeNameHandler : () => setIsChangeName(true)}
                            >
                                {isChangeName ? 'Save' : 'Edit'}
                            </button>
                        </div>
                    </div>

                    {/* Email Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Email:</h2>
                        <div className="flex flex-row items-center sm:space-x-4">
                            {isChangeEmail ? (
                                <input
                                    className="border border-gray-300 rounded-xl p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    type="email"
                                    name="email"
                                    value={newData.email}
                                    onChange={onChangeHandler}
                                />
                            ) : (
                                <p className="text-xl text-gray-600 flex-grow">
                                    <span className="block sm:hidden">
                                        {email ? `${email.slice(0, 9)}...` : 'Loading...'}
                                    </span>
                                    <span className="hidden sm:block">{email || 'Loading...'}</span>
                                </p>
                            )}
                            <div className="flex flex-row-reverse sm:flex-row items-center w-full sm:w-auto mt-3 sm:mt-0">
                                <button
                                    className={`px-4 py-2 rounded-xl text-white shadow-md transition ${isChangeEmail ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    onClick={isChangeEmail ? changeEmailHandler : () => setIsChangeEmail(true)}
                                >
                                    {isChangeEmail ? 'Save' : 'Edit'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* OTP Verification */}
                    {isEmailChange && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Verify Email:</h2>
                            <form onSubmit={OTPHandler} className="flex flex-col sm:flex-row sm:space-x-4">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="border border-gray-300 rounded-lg p-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                <button
                                    type="submit"
                                    className="mt-3 sm:mt-0 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-md"
                                >
                                    Verify
                                </button>
                            </form>
                        </div>
                    )}
                </div>
                <div className="flex justify-center items-center mt-2">
                    <button className="px-6 py-2 border border-gray-300 rounded-md shadow-md text-white bg-red-600  transition-all duration-300 ease-in-out" onClick={SignOutHandler}>
                        Sign Out
                    </button>
                </div>


            </div>
        </div>
    );
}

export default Profile;
