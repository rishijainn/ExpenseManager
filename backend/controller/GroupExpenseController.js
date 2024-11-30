// const Expense = require('../models/Expense');
// // const Group = require('../modles/GroupModle');
// const {expModel}=require(`../modles/GroupModle`);

// // Route to add a new expense
//  const postExpense=async (req, res) => {
//   const { groupId, amount, description, paidBy, beneficiaries } = req.body;

//   try {
//     const newExpense = new expModel({
//       groupId,
//       amount,
//       description,
//       paidBy,
//       beneficiaries,
//       timestamp: new Date(),
//       isSettled: false,
//     });

//     await newExpense.save();
//     res.status(200).json({ message: "Expense added successfully", expense: newExpense });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding expense", error });
//   }
// };

// // Route to retrieve expenses in a chat-like format for a specific group
// const retriveExpense= async (req, res) => {
//   const { groupId } = req.params;

//   try {
//     const expenses = await expModel.find({ groupId })
//       // .populate('paidBy beneficiaries', 'name')  // Only retrieve the name field
//       // .sort({ timestamp: -1 }); // Sort by most recent
      

//       console.log(expenses);
//     const formattedExpenses = expenses.map(expense => ({
//       message: `${expense.paidBy.name} paid Rs${expense.amount} for ${expense.description} on behalf of ${expense.beneficiaries.map(b => b.name).join(', ')}`,
//       paidById:`helllo`,
//       timestamp: expense.timestamp,
//       isSettled: expense.isSettled
//     }));

//     res.status(200).json(formattedExpenses);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching group expenses", error });
//   }
// };

// module.exports = {postExpense,retriveExpense}
