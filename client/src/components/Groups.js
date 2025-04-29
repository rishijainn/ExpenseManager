import axios from 'axios';
import React, { useEffect, useState } from 'react';
import GroupBlocks from './GroupBlocks';
import MainGroup from './MainGroup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify styles

function Groups() {
    const [isGroup, setIsGroup] = useState(false);
    const [groups, setGroup] = useState([]);
    const [viewGroup, setViewGroup] = useState(null);
    const [members,setMembers]=useState([]);
    const [refresh,setRefresh]=useState(true);

    useEffect(() => {
        const uId=localStorage.getItem('user_id');
        axios.get(`https://expense-manager-backend-eight.vercel.app/user/data/getGroup/${uId}`, { withCredentials: true })
            .then((response) => {
                setGroup(response.data.response);
                console.log(response.data.response);
            })
            .catch((error) => {
                console.log(error, ' hello error');
            });
    }, [refresh,setRefresh]);

    const createGroupHandler = (e) => {
        e.preventDefault();
        const name = e.target[0].value;
        axios
            .post(
                'https://expense-manager-backend-eight.vercel.app/user/data/createGroup',
                { name },
                { withCredentials: true }
            )
            .then((response) => {
                // First, update the groups state with the newly created group
                setIsGroup(false);
                setGroup([...groups, response.data.response]);
                
    
                // Then, add the user as a member to the newly created group
                const userId = localStorage.getItem('user_id');
                const userName = localStorage.getItem('name');
                axios.post(`https://expense-manager-backend-eight.vercel.app/user/data/addMember/${response.data.response._id}`, { userId, userName }, { withCredentials: true })
                    .then((response) => {
                        console.log(response);
                        
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error, ' error in the axios');
            });
    };
    

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <ToastContainer/>
                <div className="text-center">
                    <h1 className="md:text-5xl text-3xl font-extrabold text-gray-800">ContriSphere</h1>
                    <p className="mt-2 text-xl text-gray-500">
                        Manage your group contributions with ease
                    </p>
                </div>

                {/* Group Creation Section */}
                <div className="flex justify-center">
                    {isGroup ? (
                        <form
                            onSubmit={createGroupHandler}
                            className="w-full bg-white rounded-lg shadow p-6 space-y-4"
                        >
                            <input
                                type="text"
                                placeholder="Enter group name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsGroup(false)}
                                    className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsGroup(true)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
                        >
                            Create Group
                        </button>
                    )}
                </div>

                <div>
                    
                        {/* {viewGroup ? (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                              <MainGroup grpName={viewGroup.name} grpId={viewGroup._id} onClose={() => setViewGroup(null)} />
                            </div>
                          ) : null} */}

{viewGroup ? (
                            <div className="fixed inset-0 flex items-center justify-evenly md:w-[calc(100%-16rem)] md:ml-[16rem] mt-7 bg-opacity-100">
                              <MainGroup grpName={viewGroup.name} grpId={viewGroup._id} onClose={() => setViewGroup(null)} />
                            </div>
                          ) : null}

                    
                </div>

                {/* Group List (Single Column) */}
                <div className="space-y-6">
                    {groups.length > 0 ? (
                        groups.map((grp) => <GroupBlocks key={grp._id} grpName={grp.name} grpId={grp._id} setViewGroup={setViewGroup} viewGroup={viewGroup} refresh={refresh} setRefresh={setRefresh} />)
                    ) : (
                        <p className="text-gray-500 text-center">No groups available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Groups;
