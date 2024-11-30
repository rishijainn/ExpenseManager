import React, { useState } from 'react';
import axios from 'axios';

function SendBlock({ avialMembers, setAddContribution, grpId, userId, mapped, contributions }) {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const SendHandler = (e) => {
        e.preventDefault();
        console.log(e.target);
        const amount = e.target.elements.amount.value;
        const description = e.target.elements.description.value;
        const payerName = localStorage.getItem('name');

        const beneficiaries = selectedOptions
            .map((name) => mapped.find((item) => item.name === name)?.id)
            .filter(Boolean);

        axios.post("https://expensemanager-1-0p9e.onrender.com/user/data/addContribution", {
            groupId: grpId,
            paidBy: userId,
            payerName,
            amount,
            description,
            beneficiaries,
        }, { withCredentials: true })
            .then((response) => {
                console.log("Contribution added:", response.data);
                setAddContribution(false);
            })
            .catch((err) => {
                console.error("Error adding contribution:", err);
            });
    };

    const handleCheckboxChange = (option) => {
        setSelectedOptions((prevSelected) =>
            prevSelected.includes(option)
                ? prevSelected.filter((selected) => selected !== option)
                : [...prevSelected, option]
        );
    };

    return (
        <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full m-5 border border-gray-200 z-60">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Add Contribution</h2>

            <form onSubmit={SendHandler} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Enter the Amount"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                    />
                </div>

                <div>
                    <p className="text-sm font-semibold text-gray-600 mb-3">Select Members:</p>
                    <div className="flex flex-wrap gap-3">
                        {avialMembers.map((option, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                    className="form-checkbox text-blue-600"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Add a Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => setAddContribution(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-600 font-semibold rounded-md hover:bg-gray-300 transition-colors duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SendBlock;
