import React from 'react';
import  axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify styles


function Login() {

    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        email:'',
        password:''
    })

    const submitHandler=(event)=>{
        event.preventDefault();

        axios.post("https://expense-manager-backend-eight.vercel.app/user/login",{
            email:formData.email,
            password:formData.password
        },{
          withCredentials: true
      }).then((response)=>{
        console.log(response);
            navigate('/dashboard');
            const id=response.data.isUser._id;
            const gender=response.data.isUser.gender;
            console.log(response,"responsing the data");
            localStorage.setItem("gender",gender);
            localStorage.setItem('user_id',id);
            localStorage.setItem('email',formData.email);
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("name",response.data.isUser.name);
        }).catch((error)=>{
          const err=error.response.data.message;
          if(err==="Please sign up"){
            navigate('/');
          }
            toast.error(err)
            
        })


    }

    const changeHandler=(event)=>{
        const{name,value}=event.target;

        setFormData({
            ...formData,
            [name]:value
        })
    }


  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* Left Text Section */}
      <ToastContainer/>
      <div className="lg:w-1/2 w-full lg:text-left text-center mb-8 lg:mb-0">
        <h1 className="text-5xl font-extrabold text-white">
          Welcome to Expense Tracker
        </h1>
        <h2 className="text-2xl text-gray-200 mt-4">
          Manage your money effortlessly.
        </h2>
        <p className="text-lg text-gray-300 mt-4">
          Sign in to keep track of your expenses and make better financial decisions.
        </p>
      </div>

      {/* Right Form Section */}
      <div className="lg:w-1/2 w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div className="relative">
            <input
              type="email"
              name='email'
              value={formData.email}
              onChange={changeHandler}
              placeholder="Enter your Email ID"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute left-4 top-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12H8m0 0l4-4m-4 4l4 4m-4-4h8"
              />
            </svg>
          </div>
          <div className="relative">
            <input
              type="password"
              name='password'
              value={formData.password}
              onChange={changeHandler}
              placeholder="Enter your Password"
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute left-4 top-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12H8m0 0l4-4m-4 4l4 4m-4-4h8"
              />
            </svg>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 w-full font-semibold"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/" className="text-purple-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
