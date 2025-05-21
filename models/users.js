import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true},
    hasOnboarded: {type: Boolean, default: false},
    transactionPin: String,
    role: {type: String, enum:["client", "provider", "admin", "superAdmin"], required: true}, 
    skills: {
        primary: String,
        secondary: [String],
    },
    wallet: {
        balance: { type: Number, default: 0 },
        transactions: [{
            type: { type: String, enum: ['credit', 'debit'], required: true },
            amount: { type: Number, required: true },
            description: String,
            reference: String,
            status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
            paymentMethod: { type: String, enum: ['card', 'bank_transfer', 'withdrawal'] },
            createdAt: { type: Date, default: Date.now }
        }],
        bankDetails: {
            accountNumber: String,
            accountName: String,
            bankCode: String,
            bankName: String
        }
    }, 
    createdAt: {type: Date, default: Date.now}
});

const User = mongoose.model("User", userSchema); 

export default User;
