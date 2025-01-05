const prisma = require("../utils/db.config")

exports.startTest = async(req,res)=>{
    try{
        const {courseId} = req.body
        res.status(200).json({
            status:"success",
        })

    }catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
}