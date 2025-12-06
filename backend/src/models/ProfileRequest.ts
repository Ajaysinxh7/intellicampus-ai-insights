import mongoose, { Document, Schema } from "mongoose";

export interface IProfileRequest extends Document {
    userId: mongoose.Types.ObjectId;
    requestedChanges: {
        enrollmentNumber?: string;
        branch?: string;
        collegeName?: string;
    };
    status: "pending" | "approved" | "rejected";
    createdAt: Date;
}

const ProfileRequestSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedChanges: {
        enrollmentNumber: { type: String },
        branch: { type: String },
        collegeName: { type: String },
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

// Ensure a user can only have one pending request at a time
// ProfileRequestSchema.index({ userId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: "pending" } });

const ProfileRequest = mongoose.model<IProfileRequest>("ProfileRequest", ProfileRequestSchema);

export default ProfileRequest;
