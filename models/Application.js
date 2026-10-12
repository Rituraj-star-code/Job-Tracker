import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
        trim: true
    },
    role_profile: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Interviewing', 'Selected', 'Rejected'],
        default: 'Applied'
    },
    applied_date: {
        type: Date,
        default: Date.now
    }
});

export const Application = mongoose.model('Application', applicationSchema);