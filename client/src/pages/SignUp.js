import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        general: ''
    });

    const submitHandler = (event) => {
        event.preventDefault();

        // Clear previous errors
        setErrors({ name: '', email: '', password: '', general: '' });

        axios.post("https://expensemanager-1-0p9e.onrender.com/user/signUp", {
            name: formData.name,
            email: formData.email,
            password: formData.password
        }).then(() => {
            navigate('/login');
        }).catch((error) => {
            const err = error.response?.data?.message || "An unexpected error occurred.";
            setErrors({ ...errors, general: err });
        });
    };

    const ChangeHandler = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            <div className="bg-white shadow-2xl p-8 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-4">
                <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
                <form className="space-y-6" onSubmit={submitHandler}>
                    <div>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={ChangeHandler}
                            placeholder="Enter your Name" 
                            className={`w-full p-4 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 ease-in-out`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={ChangeHandler}
                            placeholder="Enter your Email ID" 
                            className={`w-full p-4 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 ease-in-out`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input 
                            type="password"
                            name="password" 
                            value={formData.password}
                            onChange={ChangeHandler}
                            placeholder="Enter your Password" 
                            className={`w-full p-4 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 ease-in-out`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>}
                    <div className="text-center">
                        <button 
                            type="submit" 
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 w-full transform hover:scale-105"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 mt-6">
                    Already have an account? <a href="/login" className="text-purple-600 hover:underline">Log In</a>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
