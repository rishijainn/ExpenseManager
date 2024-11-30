const expense = require("../modles/Expense");




const setExpense = async (req, res) => {
    const { amount, description } = req.body;
    const id = req.user.id;
    

    if (!amount || !description) {
        return res.status(400).json({
            success: false,
            message: "missingInfo",
        });
    }

    try {
        const newexpense = await expense.create({ amount, description, user: id });
        return res.status(200).json({
            success: true,
            message: "ok",
            data:newexpense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "tryLater",
        });
    }
};


const getexpense = async (req, res) => {
    const id = req.user.id;
    try {
        const data = await expense.find({user:id});
        return res.status(200).json({
            success: true,
            message: "done",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



const updateexpense = async (req, res) => {
    const {id} =req.params;
    const {amount,description } = req.body;

    try {
        const updatedexpense = await expense.findByIdAndUpdate(id, { amount, description }, { new: true });
        console.log(updatedexpense);
        if (!updatedexpense) {
            return res.status(404).json({
                success: false,
                message: "expense not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedexpense,
            message: "expense updated",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const deleteexpense = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedexpense = await expense.findByIdAndDelete(id);

        if (!deletedexpense) {
            return res.status(404).json({
                success: false,
                message: "expense not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "expense deleted",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports={setExpense,getexpense,updateexpense,deleteexpense};