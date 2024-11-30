const mongoose = require('mongoose');


const budgetSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    totalBudget:{
        type:Number,
        required:true
    },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
