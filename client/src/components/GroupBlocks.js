import React from 'react';
import MainGroup from './MainGroup';
import axios from 'axios';

function GroupBlocks({ grpName, grpId, setViewGroup ,refresh,setRefresh}) {

  const view=(grp)=>{
    axios.get(`http://localhost:4001/user/data/getGroupData/${grp}`,{withCredentials:true})
    .then((response)=>{
      console.log(response.data.response);
      setViewGroup(response.data.response);
    }).catch((error)=>{
      console.log(error);
    })

  }

  const leaveGroup = () => {
    const userName=localStorage.getItem("name");
    const userId=localStorage.getItem("user_id")
    axios.post(`http://localhost:4001/user/data/leaveGroup`,{ groupId:grpId,userId,userName }, {withCredentials: true})
    .then((response) => {
        console.log(response.data.response);
        setViewGroup(response.data.response); // Assuming `setViewGroup` updates the UI
        setRefresh(!refresh);
        
    })
    .catch((error) => {
        console.error("Error leaving group:", error.response?.data?.message || error.message);
        alert("Failed to leave the group.");
    });
};

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center mb-4">
      {/* Group Name */}
      <h2 className="text-xl font-semibold text-gray-700">{grpName}</h2>

      {/* Buttons aligned to the right */}
      <div className="flex space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={()=>{view(grpId)}}>
          View
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" onClick={leaveGroup}>
          Leave
        </button>
      </div>

    </div>
  );
}

export default GroupBlocks;
