import mongoose from "mongoose";





const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    createdAt: {type: Date, default: Date.now}
});


const User = mongoose.model("User", userSchema);

export default User
