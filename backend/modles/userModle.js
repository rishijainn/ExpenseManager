const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],

    income: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Income' }],

    budget: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }],
    gender: {
        type: String,
        default: "none"
    },
})

const userModle = mongoose.model('user', schema);

module.exports = userModle;