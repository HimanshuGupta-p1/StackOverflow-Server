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
    },
    friends: {
        type: Array,
        default: [],
        require: true,
      },
    accountType: {type: String, default:"free",require:true},
    noOfQues : {type:Number, require: true, default:0},
    dateAsked : {type:Date, require:true, default:Date.now()}
})

export default mongoose.model("User", userSchema)