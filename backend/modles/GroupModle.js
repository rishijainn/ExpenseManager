const mongoose=require("mongoose");


const groupSchema= new mongoose.Schema({
    name:String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    memberName:[{type:String}]
})


const ExpenseSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    beneficiaries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // Users sharing this expense
    timestamp: { type: Date, default: Date.now },
    isSettled: { type: Boolean, default: false },
    agreedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });


  const grpModel=mongoose.model('group',groupSchema);
  const expModel=mongoose.model('exp',ExpenseSchema);


  module.exports={grpModel,expModel};