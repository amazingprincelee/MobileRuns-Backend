import mongoose from "mongoose";



const waitListSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    location: String,
    role: {
        type: String,
        enum: ["client", "other", "house cleaner", "house helper","care giver","lawyer", "plumber", "electrician", "waste collector", "waste_collector", "mason man", "iron bender", "capenter", "gmp man", "solar installer", "dstv & gotv installer", "cable satellite installer", "laborer", "mechanic", "welder"]
    },
    createdAt: {type: Date, default: Date.now}
});



const WaitList = mongoose.model("WaitList", waitListSchema);

export default WaitList;
