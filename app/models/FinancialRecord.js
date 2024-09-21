import mongoose from "mongoose";

const financialRecordSchema = new mongoose.Schema({
    income: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const FinancialRecord = mongoose.models.FinancialRecord || mongoose.model("FinancialRecord", financialRecordSchema);

export default FinancialRecord;
