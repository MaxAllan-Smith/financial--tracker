import mongoose from "mongoose";

const financialRecordsSchema = new mongoose.Schema({
    income: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        requried: true,
    },
    name: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const FinancialRecord = mongoose.models.FinancialRecord || mongoose.model("FinancialRecord", financialRecordsSchema);

export default FinancialRecord;