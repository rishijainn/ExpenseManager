const Budget = require("../modles/Budget");  // Corrected 'models' directory name

// Set Budget
const setBudget = async (req, res) => {
    const { title, totalBudget } = req.body;
    const id = req.user.id;

    if (!title || !totalBudget) {
        return res.status(400).json({
            success: false,
            message: "missingInfo",
        });
    }

    const budgetAlreadyAllotted = await Budget.findOne({ title ,user:id});
    console.log(budgetAlreadyAllotted);

    if (budgetAlreadyAllotted) {
        return res.status(400).json({
            success: false,
            message: "Budget is already assigned",
        });
    }

    try {
        const newBudget = await Budget.create({ title, totalBudget, user: id });
        return res.status(200).json({
            success: true,
            message: "ok",
            data:newBudget
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: " There is some issue in Server , Try Later",
        });
    }
};

// Get All Budgets
const getBudget = async (req, res) => {
    const id = req.user.id;
    try {
        const data = await Budget.find({user:id});
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

// Update Budget
const updateBudget = async (req, res) => {
    const {id} =req.params;
    const {title, totalBudget } = req.body;

    try {
        const updatedBudget = await Budget.findByIdAndUpdate(id, { title, totalBudget }, { new: true });
        console.log(updateBudget);
        if (!updatedBudget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedBudget,
            message: "Budget updated",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error, please try again later",
        });
    }
};

// Delete Budget
const deleteBudget = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBudget = await Budget.findByIdAndDelete(id);

        if (!deletedBudget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget deleted",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error,Please try again Later",
        });
    }
};

module.exports = { setBudget, getBudget, updateBudget, deleteBudget };
