import mongoose from "mongoose";



const waitListSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    location: String,
    role: {
        type: String,
        enum: ['client', 'service provider']
    },
    createdAt: {type: Date, default: Date.now}
});



const WaitList = mongoose.model("WaitList", waitListSchema);

export default WaitList;
