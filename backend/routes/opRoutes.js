const express= require("express");
const {setBudget, getBudget, updateBudget, deleteBudget}=require("../controller/BudgetController");

const {setIncome,getIncome, updateIncome, deleteIncome}=require("../controller/IncomeController");

const {setExpense,getexpense,updateexpense,deleteexpense}=require("../controller/ExpenseController");
const { CreateGroup, getGroupData, getDataById, addMembers, getMembersById, addContribution, getContribution, settleExpense, leaveGroup} = require("../controller/GroupController");

const OpRouter=express.Router();

// budget operations 
OpRouter.post("/Budget/post",setBudget);
OpRouter.get("/Budget/get",getBudget);
OpRouter.patch("/Budget/update/:id",updateBudget);
OpRouter.delete("/Budget/delete/:id",deleteBudget);


// Income operations

OpRouter.post("/Income/post",setIncome);
OpRouter.get("/Income/get",getIncome);
OpRouter.patch("/Income/update/:id",updateIncome);
OpRouter.delete("/Income/delete/:id",deleteIncome);

//Expense operations

OpRouter.post("/Expense/post",setExpense);
OpRouter.get("/Expense/get",getexpense);
OpRouter.patch("/Expense/update/:id",updateexpense);
OpRouter.delete("/Expense/delete/:id",deleteexpense);



//Group operations

OpRouter.post("/createGroup",CreateGroup);
OpRouter.get("/getGroup/:uId",getGroupData);
OpRouter.get("/getGroupData/:id",getDataById);
OpRouter.post("/addMember/:groupId",addMembers);
OpRouter.get("/getMember/:id",getMembersById);
OpRouter.post("/leaveGroup",leaveGroup)

//Contribution

OpRouter.post("/addContribution",addContribution);
OpRouter.get("/getContribution/:grpId",getContribution);
OpRouter.delete("/settleExpense/:ExpenseId",settleExpense);






module.exports=OpRouter;