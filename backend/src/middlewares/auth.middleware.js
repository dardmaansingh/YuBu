import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        //get token from cookie or authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        //verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        //find user in db
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

//middleware to check user roles
export const authorizeRoles = (...roles) => {
    return (req, _, next) => {
        if (!roles.includes(req.user?.role)) {
            throw new ApiError(
                403, 
                `Role: ${req.user?.role} is not allowed to access this resource`
            )
        }
        next()
    }
}

