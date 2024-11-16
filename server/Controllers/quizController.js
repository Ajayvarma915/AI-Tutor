const prisma  = require("../utils/db.config")


exports.StartQuizSession = async(req,res)=>{
    try{
        const {classId,userId} = req.body
        res.status(200).json({
            status:"success",
            message:"quiz created"
        })
    }
    catch(e){
        res.status(400).json({
            status:"Failed",
            message:e.message
        })
    }
}