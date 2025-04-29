import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true},
    role: {type: String, enum:["client", "provider", "admin", "superAdmin"], required: true}, 
    skills: {
        primary: String,
        secondary: [String],
    }, 
    createdAt: {type: Date, default: Date.now}
});


const User = mongoose.model("User", userSchema); 

export default User;
