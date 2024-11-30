const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    amount: Number,
    source: String,
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;
