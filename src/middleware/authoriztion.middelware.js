
export const isAuthorized = (...roles)=>{
    return (req , res , next)=>{
        if (!roles.includes(req.user.role))
        return next(new Error("not authorized user",{cause:403}))
        
        return next()
    }
}