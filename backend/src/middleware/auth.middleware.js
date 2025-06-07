import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({message: "Unatuhorized - No token provided."})
        }
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        if(!decoded) {
            return res.status(401).json({message: "Unatuhorized - Invalid token provided."})
        }
        const user =  await User.findById(decoded.userId).select("-password")
        if(!user) {
            return res.status(404).json({message: "User not found."})
        }
        req.user = user
        next()
    } catch (error) {
        console.log("Error in middleware controller.",error)
        res.status(500).json({message: "Internal server error."})
        
    }
};

