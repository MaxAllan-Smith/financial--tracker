import mongoose from "mongoose";

// Assuming you have already defined FinancialRecord in another file
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    financialRecords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FinancialRecord'
    }]
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
