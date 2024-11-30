const mongoose=require("mongoose");

const expenseSchema=new mongoose.Schema({
    amount: Number,
    description: String,
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
})

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;