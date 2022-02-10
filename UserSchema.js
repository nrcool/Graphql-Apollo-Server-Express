const mongoose= require("mongoose")
const {Schema}=mongoose


 const UserSchema=new Schema({
    name: {type:String},
    age: {type:Number},
    products: [{type:mongoose.Schema.Types.ObjectId,ref:"products"}]
 })

 const UsersCollection=mongoose.model("users",UserSchema)

 module.exports=UsersCollection


