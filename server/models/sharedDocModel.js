import mongoose from "mongoose";

const sharedDocSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'document', required: true },
    sharedAt: { type: Date, default: Date.now },
    isSeen: { type: Boolean, default: false } // Future feature: Unread badge
});

// Ek file ek bande ko do baar share na ho, unique index lagayenge
sharedDocSchema.index({ receiver: 1, document: 1 }, { unique: true });

const sharedDocModel = mongoose.models.sharedDoc || mongoose.model("sharedDoc", sharedDocSchema);

export default sharedDocModel;