import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SendBlock from './SendBlock';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify styles
import { HiOutlineRefresh } from "react-icons/hi";


function MainGroup({ grpName, grpId, onClose }) {
    const [avialMembers, setavailMembers] = useState(null);
    const [isAddMember, setIsAddMember] = useState(false);
    const [AddContribution, setAddContribution] = useState(false);
    const userId = localStorage.getItem('user_id');
    const [mapped, setMapped] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        getMembers();
        fetchContributions();
    }, [AddContribution, refresh, setRefresh]);


    const settle = (expId) => {
        console.log(expId)
        axios.delete(`https://expensemanager-1-0p9e.onrender.com/user/data/settleExpense/${expId}`, { withCredentials: true })
            .then((response) => {
                setRefresh(!refresh);
                console.log(response.data);
                toast.success('expense settled successfully')
            })
            .catch((error) => {
                console.error("Error fetching contributions:", error);
                toast.error('Error settling expense. Please try again.')
            });
    }
    const fetchContributions = () => {
        axios.get(`https://expensemanager-1-0p9e.onrender.com/user/data/getContribution/${grpId}`, { withCredentials: true })
            .then((response) => {
                setContributions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching contributions:", error);
                toast.error('Error featching contributions. Please try again.')
            });
    };

    const getMembers = () => {
        axios.get(`https://expensemanager-1-0p9e.onrender.com/user/data/getMember/${grpId}`, { withCredentials: true })
            .then((response) => {
                setavailMembers(response.data.response.memberName);
                const a = response.data.response.memberName;
                const b = response.data.response.members;
                setMapped(a.map((item, index) => ({ name: item, id: b[index] })));
            })
            .catch((err) => {
                console.log(err);
                toast.error('Error featching members. Please try again.')
            });
    };

    const AddHandler = (e) => {
        e.preventDefault();
        const id = e.target[0].value;
        axios.get(`https://expensemanager-1-0p9e.onrender.com/user/getUser/${id}`, { withCredentials: true })
            .then((response) => {
                const userData = response.data.response;
                axios.post(`https://expensemanager-1-0p9e.onrender.com/user/data/addMember/${grpId}`, { userId: userData._id, userName: userData.name }, { withCredentials: true })
                    .then(() => {
                        getMembers();
                        toast.success('member added successfully')
                        setIsAddMember(false)
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error('Error adding member. Please try again.')
                    });
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
                toast.error('There is no such Id Exist. Please try again.')
            });
    };

    return (
        <div className="bg-white shadow-2xl rounded-lg sm:p-8 p-5  w-full  lg:max-w-3xl min-w-xl mt-10 z-30 relative overflow-hidden transition-transform duration-300 m-5">
            {/* Close Button */}

            <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    pauseOnHover
    style={{
        zIndex: 9999, // Keeps it above other elements
        marginTop: '60px' // Adjust this value to move it down
    }}
/>

            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 focus:outline-none transition-transform transform hover:scale-125"
                onClick={onClose}
            >
                ✕
            </button>

            {/* Group Name */}
            <h1 className="sm:text-4xl text-xl font-extrabold text-center mb-6 text-gray-800 tracking-wide">
                {grpName}
            </h1>

            {/* Member List & Add Member Button */}
            <div className="flex sm:flex-row flex-col items-center gap-6 mb-6">
                {/* Member List */}
                <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-inner w-full">
                    {/* <h3 className="text-2xl font-semibold text-gray-700 mb-3">Members</h3> */}
                    {avialMembers && avialMembers.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {avialMembers.map((mem, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-500 hover:text-white transition-all duration-300"
                                >
                                    {mem}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 italic">No members found.</p>
                    )}
                </div>

                {/* Add Member Button */}
                <div>
                    <button
                        onClick={() => setIsAddMember(true)}
                        className="sm:px-6 px-8  py-2 bg-blue-600 text-white font-bold text-md  rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 "
                    >
                        Add Member
                    </button>
                </div>
            </div>

            {/* Add Member Form */}
            {isAddMember && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-4 border border-gray-200 relative">
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-600 font-bold text-lg"
                        onClick={() => setIsAddMember(false)}
                    >
                        x
                    </button>

                    {/* Add Member Form */}
                    <form onSubmit={AddHandler} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Enter User Email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all duration-300"
                        >
                            Add
                        </button>
                    </form>
                </div>
            )}


            {/* Contribution Form */}
            <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="sm:text-2xl text-xl font-semibold text-gray-700">Contributions</h3>

                    {/* Add Contribution Button */}
                    <button
                        onClick={() => setAddContribution(true)}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition-all duration-300"
                    >
                
                        <span className="block sm:hidden">
                            Add
                        </span>
                        <span className="hidden sm:block">Add Contribution</span>
                    </button>
                </div>

                {/* Reload Button below Add Contribution Button */}
                <div className="flex justify-end mb-4">
                    <button onClick={() => setRefresh(!refresh)} className="text-gray-600 hover:text-gray-800 transition-all">
                        <HiOutlineRefresh size={24} />
                    </button>
                </div>

                {AddContribution && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center md:w-[calc(100%-16rem)] md:ml-[16rem]  z-50 transition-opacity duration-300 ">
                        <SendBlock
                            avialMembers={avialMembers}
                            setAddContribution={setAddContribution}
                            grpId={grpId}
                            userId={userId}
                            mapped={mapped}
                            contributions={contributions}
                            setContributions={setContributions}
                        />
                    </div>
                )}
            </div>

            {/* Contributions List */}
            <div className="mt-8 z-50">
                {/* <ToastContainer/> */}

                


                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 focus:outline-none transition-transform transform hover:scale-125"
                    onClick={onClose}
                >
                    ✕
                </button>
                <div className="sm:h-64 h-48 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-inner">
                    {contributions.length > 0 ? (
                        contributions.map((contribution, index) => (
                            <div
                                key={index}
                                className="mb-4 p-4 border-b border-gray-300 rounded-md bg-white shadow"
                            >
                                <p className="text-gray-700 font-medium">
                                    <strong>Message:</strong> {contribution.message}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    <strong>Timestamp:</strong>{' '}
                                    {new Date(contribution.timestamp).toLocaleString()}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    <strong>Settled:</strong>{' '}
                                    {contribution.isSettled ? 'Yes' : 'No'}
                                </p>

                                <div>
                                    {contribution.paidById._id === userId ?
                                        (<button className='bg-green-500 p-2 rounded-md' onClick={() => { settle(contribution.expId) }}>Settle</button>) :
                                        (null)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm text-center italic">
                            No contributions found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );


}

export default MainGroup;
