const income = require("../modles/Income");




const setIncome = async (req, res) => {
    const { amount, source } = req.body;
    const id = req.user.id;
    

    if (!amount || !source) {
        return res.status(400).json({
            success: false,
            message: "missingInfo",
        });
    }

    const incomeAlreadyAllotted = await income.findOne({ source ,user:id});
    console.log(incomeAlreadyAllotted);

    if (incomeAlreadyAllotted) {
        return res.status(401).json({
            success: false,
            message: "income is already assigned",
        });
    }

    try {
        const newincome = await income.create({ amount, source, user: id });
        return res.status(200).json({
            success: true,
            message: "ok",
            data:newincome
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "tryLater",
        });
    }
};


const getIncome = async (req, res) => {
    const id = req.user.id;
    try {
        const data = await income.find({user:id});
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



const updateIncome = async (req, res) => {
    const {id} =req.params;
    const {amount,source } = req.body;

    try {
        const updatedIncome = await income.findByIdAndUpdate(id, { amount, source }, { new: true });
        console.log(updatedIncome);
        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedIncome,
            message: "Income updated",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const deleteIncome = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedIncome = await income.findByIdAndDelete(id);

        if (!deletedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Income deleted",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports={setIncome,getIncome,updateIncome,deleteIncome};