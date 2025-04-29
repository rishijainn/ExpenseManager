import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function Budget({ budgets, setBudgets, loading, setTotalBud}) {
  const [showForm, setShowForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    title: '',
    totalBudget: '',
  });
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [error, setError] = useState(null);

  const AddHandler = () => {
    setShowForm(!showForm);
    setEditingBudgetId(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (editingBudgetId) {

            const originalBudget = budgets.find((bud) => bud._id === editingBudgetId);
            const originaltotalBudget = parseFloat(originalBudget.totalBudget);
      axios
        .patch(`https://expense-manager-backend-eight.vercel.app/user/data/Budget/update/${editingBudgetId}`, newBudget, { withCredentials: true })
        .then((response) => {
          setBudgets(budgets.map((budget) => (budget._id === editingBudgetId ? response.data.data : budget)));
          setShowForm(false);
          setEditingBudgetId(null);
          setTotalBud((prevTotal)=>prevTotal-originaltotalBudget+response.data.data.totalBudget);
          toast.success('Budget updated successfully!');
        })
        .catch((error) => {
          setError(error.response?.data?.message || 'Failed to update budget');
          toast.error('Failed to update budget.');
        });
    } else {
      axios
        .post('https://expense-manager-backend-eight.vercel.app/user/data/Budget/post', newBudget, { withCredentials: true })
        .then((response) => {
          setBudgets([...budgets, response.data.data]);
          setShowForm(false);
          setTotalBud((prevTotal)=>prevTotal+response.data.data.totalBudget);
          toast.success('Budget added successfully!');
        })
        .catch((error) => {
          setError(error.response?.data?.message || 'Failed to add budget');
          toast.error('Failed to add budget.');
        });
    }

    setNewBudget({
      title: '',
      totalBudget: '',
    });
  };

  const handleChange = (e) => {
    setNewBudget({
      ...newBudget,
      [e.target.name]: e.target.value,
    });
  };

  const deleteHandler = (budget) => {
    axios
      .delete(`https://expense-manager-backend-eight.vercel.app/user/data/Budget/delete/${budget._id}`, { withCredentials: true })
      .then(() => {
        setBudgets(budgets.filter((bud) => bud._id !== budget._id));
        setTotalBud((prevTotal)=>prevTotal-budget.totalBudget);
        toast.success('Budget removed successfully!');
      })
      .catch(() => {
        setError('Failed to delete budget.');
        toast.error('Failed to delete budget.');
      });
  };

  const startUpdateHandler = (budget) => {
    setShowForm(true);
    setEditingBudgetId(budget._id);
    setNewBudget({
      title: budget.title,
      totalBudget: budget.totalBudget,
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-xl shadow-lg max-w-4xl mx-auto">
      <ToastContainer /> {/* Add Toast Container */}
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Your Budgets</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        className="mb-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
        onClick={AddHandler}
      >
        {showForm ? 'Cancel' : 'Add Budget'}
      </button>

      {showForm && (
        <form className="space-y-4 mb-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="title"
              value={newBudget.title}
              onChange={handleChange}
              placeholder="Budget Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <input
              type="number"
              name="totalBudget"
              value={newBudget.totalBudget}
              onChange={handleChange}
              placeholder="Total Budget"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            {editingBudgetId ? 'Update Budget' : 'Submit'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {budgets.length > 0 ? (
            budgets.map((budget) => (
              <div
                key={budget._id}
                className="flex justify-between items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{budget.title}</h3>
                  <p className="text-sm text-gray-600">Budget: ₹{budget.totalBudget}</p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => startUpdateHandler(budget)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteHandler(budget)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No budgets available. Add a new one!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Budget;
