import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function Expense({ Expense, setExpense, loading, setLoading ,setTotalExp}) {
    const [adding, setAdding] = useState(false);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get("https://expense-manager-backend-eight.vercel.app/user/data/expense/get", { withCredentials: true })
            .then((response) => {
                setExpense(response.data.data);
                
            })
            .catch((error) => {
                const message = error.response?.data?.message || 'Error fetching expenses';
                setError(message);
                toast.error(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setExpense, setLoading]);

    const changeHandler = (e) => {
        setNewExpense({
            ...newExpense,
            [e.target.name]: e.target.value
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (editingId) {
            // Update expense
            const originalExpense = Expense.find((exp) => exp._id === editingId);
            const originalAmount = parseFloat(originalExpense.amount);
            axios.patch(`https://expense-manager-backend-eight.vercel.app/user/data/expense/update/${editingId}`, newExpense, { withCredentials: true })
                .then((response) => {
                    setExpense(Expense.map((exp) => (exp._id === editingId ? response.data.data : exp)));
                    setEditingId(null);
                    setAdding(false);
                    setNewExpense({ description: '', amount: '' });
                    setTotalExp((prevTotal)=>prevTotal-originalAmount+response.data.data.amount);
                    toast.success('Expense updated successfully!');
                })
                .catch((error) => {
                    const message = error.response?.data?.message || 'Error updating expense';
                    setError(message);
                    toast.error(message);
                });
        } else {
            // Add expense
            axios.post("https://expense-manager-backend-eight.vercel.app/user/data/expense/post", newExpense, { withCredentials: true })
                .then((response) => {
                    const addedExpense=response.data.data;
                    setExpense([...Expense, response.data.data]);
                    setAdding(false);
                    setNewExpense({ description: '', amount: '' });
                    setTotalExp((prevTotal) => prevTotal + addedExpense.amount);
                    toast.success('Expense added successfully!');

                })
                .catch((error) => {
                    const message = error.response?.data?.message || 'Error adding expense';
                    setError(message);
                    toast.error(message);
                });
        }
    };

    const deleteHandler = (_id,amount) => {
        axios.delete(`https://expense-manager-backend-eight.vercel.app/user/data/expense/delete/${_id}`, { withCredentials: true })
            .then(() => {
                setExpense(Expense.filter((exp) => exp._id !== _id));
                setTotalExp((prevTotal)=>prevTotal-amount);
                toast.success('Expense removed successfully!');
            })
            .catch((error) => {
                const message = error.response?.data?.message || 'Error deleting expense';
                setError(message);
                toast.error(message);
            });
    };

    const UpdateHandler = (exp) => {
        const currentAmount=exp.amount;
        setEditingId(exp._id);
        setAdding(true);
        setNewExpense({ description: exp.description, amount: exp.amount });
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Expense Section
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
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Expense Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            placeholder="e.g. Rent, Groceries"
                            value={newExpense.description}
                            onChange={changeHandler}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            placeholder="e.g. 2000"
                            value={newExpense.amount}
                            onChange={changeHandler}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            required
                        />
                    </div>
            
                    {/* Add Expense Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                        {editingId ? 'Update Expense' : 'Add Expense'}
                    </button>
            
                    {/* Close Button below the Add button */}
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
                        Add Expense
                    </button>
                )}
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <div className="space-y-4">
                    {Expense.length > 0 ? (
                        Expense.map((exp) => (
                            <div
                                key={exp._id}
                                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">{exp.description}</h3>
                                    <p className="text-gray-500">Amount: ₹{exp.amount}</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        className="bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500 transition"
                                        onClick={() => UpdateHandler(exp)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => deleteHandler(exp._id,exp.amount)}
                                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            <p>No expenses added</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Expense;
