const jwt = require("jsonwebtoken");
require('dotenv').config();
const skey = process.env.secretKey;

const auth = async (req, res, next) => {
    const token = req.cookies.cookies || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

    console.log("token: ",req.body.token," cookie: ",req.cookies.cookies," Auth: ",req.header("Authorization")?.replace("Bearer ", ""));
    
    // Log the token for debugging purposes
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please SignUp"
        });
    }

    try {
        console.log(token)
        // Verify token
        const payload = jwt.verify(token, skey);
        req.user = payload;  // Attach the user info to the request
        console.log("Payload:", payload);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "please login"
        });
    }
    
    next();
};

module.exports = { auth };
