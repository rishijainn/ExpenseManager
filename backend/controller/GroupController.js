
const {grpModel,expModel}=require('../modles/GroupModle');

const CreateGroup=async(req,res)=>{

    const {name}=req.body;
    if(!name){
        res.status(400).json({
            success:false,
            message:"Please Enter the Name",
        })
    }

    try{
        const response = await grpModel.create({name,members:[],memberName:[]});
    console.log(response);
    res.status(200).json({
        success:true,
        message:"group created successfully",
        response:response
    })

    }catch(error){
        res.status(400).json({
            success:false,
            message:"There is Some Error in Server",
        })
    }

    
}

const getGroupData=async(req,res)=>{

    try{

         const {uId}=req.params;
        const response = await grpModel.find({ members: { $in: [uId] } });

        console.log("afer4")
        console.log("hellloo")
        return res.status(200).json({
        success:true,
        message:"here is your data",
        response:response
    })

    }catch(error){
        console.log("error")
        return res.status(400).json({
            success:false,
            message:"There is Some Error in Server",
        })
    }
    
}

const getDataById=async(req,res)=>{
    try{
        const {id}=req.params;
        const response=await  grpModel.findById(id);

        return res.status(200).json({
            success:true,
            message:"here is your data",
            response:response
        })


    }catch(error){
        return res.status(400).json({
            success:false,
            message:"There is Some Error in Server",
        })

    }
}


const addMembers = async (req, res) => {
    try {
        const { groupId } = req.params; // Get the group ID from the URL
        const { userId, userName } = req.body; // Get the user ID and name from the request body

        // Find the group by its ID
        const group = await grpModel.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if the user is already in the group's members
        const isUserAlreadyMember = group.members.includes(userId);

        if (isUserAlreadyMember) {
            return res.status(400).json({ error: 'Member already exists in the group' });
        }

        // Add the new member to the group
        group.members.push(userId);
        group.memberName.push(userName);

        // Save the updated group
        await group.save();

        // Optionally populate members (if needed) before returning the response
        const populatedGroup = await group.populate('members');

        res.status(200).json({ message: 'Member added successfully', group: populatedGroup });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add member' });
    }
};


const getMembersById=async(req,res)=>{

    try{
        const {id}=req.params;
    const response= await grpModel.findById(id);
    console.log(response)
    return res.status(200).json({
        success:"true",
        message:"Group found successfully",
        response:response
    })

    }catch(error){
        res.status(500).json({ error: 'Failed to find group' });
    }
    
}

const addContribution = async (req, res) => {
    const { groupId, amount, description, paidBy, beneficiaries } = req.body;

  try {
    const newExpense = new expModel({
      groupId,
      amount,
      description,
      paidBy,
      beneficiaries,
      timestamp: new Date(),
      isSettled: false,
    });

    await newExpense.save();
    res.status(200).json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
};


const getContribution = async (req, res) => {
    const { grpId } = req.params;

    try {
        // Query using the correct field name `groupId`
        const expenses = await expModel.find({ groupId: grpId })
            .populate('paidBy', 'name')            // Populate paidBy with only the name field
            .populate('beneficiaries', 'name')     // Populate beneficiaries with only the name field
            .sort({ timestamp: -1 });       
            
            // Sort by most recent
            console.log(expenses);

        // Format the expenses for readability
        const formattedExpenses = expenses.map(expense => ({
            message: `${expense.paidBy?.name} paid ₹${expense.amount} for ${expense.description} on behalf of ${expense.beneficiaries.map(b => b.name).join(', ')}`,
            timestamp: expense.timestamp,
            paidById:expense.paidBy,
            expId:expense._id,
            isSettled: expense.isSettled
        }));

        res.status(200).json(formattedExpenses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching group expenses", error });
    }
};



const settleExpense = async (req, res) => {
    const { ExpenseId } = req.params; // Get the expense ID from the URL

    try {
        // Find the expense by its ID and update the isSettled field to true
        const updatedExpense = await expModel.findByIdAndDelete(
            ExpenseId
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({ message: "Expense settled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error settling expense", error });
    }
};

const leaveGroup = async (req, res) => {
    const { groupId, userId,userName } = req.body; // Get group ID and user ID from the request body
    console.log(groupId,userId,userName)

    try {
        // Update the group by removing the user from both 'members' and 'memberName'
        const updatedGroup = await grpModel.findByIdAndUpdate(
            groupId,
            {
                $pull: {
                    members: userId,
                    memberName: userName, // Assuming memberName contains user objects with `userId`
                },
            },
            { new: true } // Return the updated group document
        );

        if (!updatedGroup) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "You have successfully left the group",
            group: updatedGroup,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error leaving the group",
            error,
        });
    }
};





module.exports={CreateGroup,getGroupData,getDataById,addMembers,getMembersById,addContribution,getContribution,settleExpense,leaveGroup};