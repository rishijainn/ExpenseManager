import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function Income({ Income, setIncome, loading, setLoading,setTotalEnc }) {
  const [adding, setAdding] = useState(false);
  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch income data from backend
  useEffect(() => {
    setLoading(true);
    axios
      .get('https://expense-manager-backend-eight.vercel.app/user/data/Income/get', { withCredentials: true })
      .then((response) => {
        setIncome(response.data.data);
      })
      .catch((error) => {
        setError(error.response.data.message || 'Failed to load income data.');
        toast.error(error.response.data.message || 'Error fetching income data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setIncome, setLoading]);

  const changeHandler = (e) => {
    setNewIncome({
      ...newIncome,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing income
            const originalIncome = Income.find((inc) => inc._id === editingId);
            const originalAmount = parseFloat(originalIncome.amount);
      axios
        .patch(`https://expense-manager-backend-eight.vercel.app/user/data/Income/update/${editingId}`, newIncome, { withCredentials: true })
        .then((response) => {
          setIncome(Income.map((inc) => (inc._id === editingId ? response.data.data : inc)));
          setEditingId(null);
          setAdding(false);
          setNewIncome({ source: '', amount: '' });
          setTotalEnc((prevTotal)=>prevTotal-originalAmount+response.data.data.amount);
          toast.success('Income updated successfully!');
        })
        .catch((error) => {
          setError(error.response.data.message || 'Failed to update income.');
          toast.error(error.response.data.message || 'Error updating income.');
        });
    } else {
      // Add new income
      axios
        .post('https://expense-manager-backend-eight.vercel.app/user/data/Income/post', newIncome, { withCredentials: true })
        .then((response) => {
          setIncome([...Income, response.data.data]);
          setAdding(false);
          setNewIncome({ source: '', amount: '' });
          setTotalEnc((prevTotal)=>prevTotal+response.data.data.amount);
          toast.success('Income added successfully!');
        })
        .catch((error) => {
          setError(error.response.data.message || 'Failed to add income.');
          toast.error(error.response.data.message || 'Error adding income.');
        });
    }
  };

  const deleteHandler = (_id,amount) => {
    axios
      .delete(`https://expense-manager-backend-eight.vercel.app/user/data/Income/delete/${_id}`, { withCredentials: true })
      .then(() => {
        setIncome(Income.filter((inc) => inc._id !== _id));
        setTotalEnc((prevTotal)=>prevTotal-amount);
        toast.success('Income removed successfully!');
      })
      .catch((error) => {
        setError(error.response.data.message || 'Failed to delete income.');
        toast.error(error.response.data.message || 'Error deleting income.');
      });
  };

  const UpdateHandler = (inc) => {
    setEditingId(inc._id);
    setAdding(true);
    setNewIncome({
      source: inc.source,
      amount: inc.amount,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Manage Your Income
      </h2>

      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        {adding ? (
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                Income Source
              </label>
              <input
                type="text"
                name="source"
                id="source"
                placeholder="e.g. Salary, Freelancing"
                value={newIncome.source}
                onChange={changeHandler}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Monthly Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="e.g. 5000"
                value={newIncome.amount}
                onChange={changeHandler}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              {editingId ? 'Update Income' : 'Add Income'}
            </button>

            <button
                        type="button"
                        onClick={() => setAdding(false)}  // Close the form
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition mt-4"
                    >
                        Close
                    </button>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Add Income
          </button>
        )}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div>
          {Income.length > 0 ? (
            <div className="grid gap-4">
              {Income.map((inc) => (
                <div
                  key={inc._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-md border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{inc.source}</h3>
                    <p className="text-gray-500">₹{inc.amount} per month</p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => UpdateHandler(inc)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteHandler(inc._id,inc.amount)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No income sources added yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Income;
