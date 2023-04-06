import mongoose from "mongoose";

mongoose.set('strictQuery', false)
const userSchema = mongoose.Schema({
    name: {type: String, require:true},
    email: {type: String, require:true},
    password: {type: String, require:true},
    about: {type: String, require:true},
    tags: {type: [String]},
    joinedOn: {type: Date, default:Date.now()},
    otp:{
        type:String,
        // required:true
    }
})

export default mongoose.model("User", userSchema)